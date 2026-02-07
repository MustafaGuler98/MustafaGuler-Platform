"use client";

import { useEffect, useRef } from "react";

interface NeuralNetworkProps {
    className?: string;
}

export default function NeuralNetwork({ className }: NeuralNetworkProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number | undefined>(undefined);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d")!;
        if (!ctx) return;

        let width = 0;
        let height = 0;
        let isVisible = true;

        // Configuration
        const opts = {
            range: 100, // Slightly reduced for faster init
            baseConnections: 3,
            addedConnections: 2, // Reduced for faster init
            baseSize: 4,
            minSize: 1,
            sizeMultiplier: 0.7,
            allowedDist: 35,
            baseDist: 35,
            addedDist: 25,
            connectionAttempts: 60, // Reduced from 100 for faster init
            rotVelX: 0.12, // radians per second (not per frame!)
            rotVelY: 0.18, // radians per second
            depth: 200,
            focalLength: 200,
            vanishPoint: { x: 0, y: 0 },
        };

        const resize = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
            width = canvas.offsetWidth;
            height = canvas.offsetHeight;
            canvas.width = Math.max(1, Math.floor(width * dpr));
            canvas.height = Math.max(1, Math.floor(height * dpr));
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            opts.vanishPoint.x = width / 2;
            opts.vanishPoint.y = height / 2;
        };
        resize();
        window.addEventListener("resize", resize, { passive: true });

        const visibilityObserver = new IntersectionObserver(
            (entries) => {
                isVisible = entries[0]?.isIntersecting ?? true;
            },
            { threshold: 0.01 }
        );
        visibilityObserver.observe(canvas);

        const squareRange = opts.range * opts.range;
        const squareAllowed = opts.allowedDist * opts.allowedDist;
        const mostDistant = opts.depth + opts.range;

        let sinX = 0, sinY = 0, cosX = 1, cosY = 1;
        let time = 0; // Total elapsed time in seconds
        let lastTime = performance.now();
        let frameCount = 0;

        interface Connection {
            x: number;
            y: number;
            z: number;
            size: number;
            links: Connection[];
            isEnd: boolean;
            glowSpeed: number;
            screen: { x: number; y: number; z: number; scale: number; color: string };
        }

        const connections: Connection[] = [];
        const toDevelop: Connection[] = [];

        function createConnection(x: number, y: number, z: number, size: number): Connection {
            return {
                x, y, z, size,
                links: [],
                isEnd: false,
                glowSpeed: 0.3 + Math.random() * 0.3,
                screen: { x: 0, y: 0, z: 0, scale: 1, color: "" },
            };
        }

        function squareDist(a: { x: number; y: number; z: number }, b: { x: number; y: number; z: number }) {
            const dx = b.x - a.x, dy = b.y - a.y, dz = b.z - a.z;
            return dx * dx + dy * dy + dz * dz;
        }

        function linkConnection(conn: Connection) {
            if (conn.size < opts.minSize) {
                conn.isEnd = true;
                return;
            }

            const connectionsNum = opts.baseConnections + Math.floor(Math.random() * opts.addedConnections);
            let attempt = opts.connectionAttempts;
            const newLinks: { x: number; y: number; z: number }[] = [];

            while (newLinks.length < connectionsNum && --attempt > 0) {
                const alpha = Math.random() * Math.PI;
                const beta = Math.random() * Math.PI * 2;
                const len = opts.baseDist + opts.addedDist * Math.random();

                const cosA = Math.cos(alpha), sinA = Math.sin(alpha);
                const cosB = Math.cos(beta), sinB = Math.sin(beta);

                const pos = {
                    x: conn.x + len * cosA * sinB,
                    y: conn.y + len * sinA * sinB,
                    z: conn.z + len * cosB,
                };

                if (pos.x * pos.x + pos.y * pos.y + pos.z * pos.z < squareRange) {
                    let passedExisting = true;
                    let passedBuffered = true;

                    for (const c of connections) {
                        if (squareDist(pos, c) < squareAllowed) {
                            passedExisting = false;
                            break;
                        }
                    }

                    if (passedExisting) {
                        for (const l of newLinks) {
                            if (squareDist(pos, l) < squareAllowed) {
                                passedBuffered = false;
                                break;
                            }
                        }
                    }

                    if (passedExisting && passedBuffered) {
                        newLinks.push(pos);
                    }
                }
            }

            if (newLinks.length === 0) {
                conn.isEnd = true;
            } else {
                for (const pos of newLinks) {
                    const newConn = createConnection(pos.x, pos.y, pos.z, conn.size * opts.sizeMultiplier);
                    conn.links.push(newConn);
                    connections.push(newConn);
                    toDevelop.push(newConn);
                }
            }
        }

        function setScreen(obj: { x: number; y: number; z: number; screen: Connection["screen"] }) {
            let x = obj.x, y = obj.y, z = obj.z;

            // Rotate X
            const Y = y;
            y = y * cosX - z * sinX;
            z = z * cosX + Y * sinX;

            // Rotate Y
            const Z = z;
            z = z * cosY - x * sinY;
            x = x * cosY + Z * sinY;

            obj.screen.z = z;
            z += opts.depth;

            obj.screen.scale = opts.focalLength / z;
            obj.screen.x = opts.vanishPoint.x + x * obj.screen.scale;
            obj.screen.y = opts.vanishPoint.y + y * obj.screen.scale;
        }

        // Initialize network
        const root = createConnection(0, 0, 0, opts.baseSize);
        connections.push(root);
        linkConnection(root);

        while (toDevelop.length > 0) {
            linkConnection(toDevelop.shift()!);
        }

        function animate(now: number) {
            animationRef.current = requestAnimationFrame(animate);

            // Calculate deltaTime for frame-rate independence
            const deltaTime = (now - lastTime) / 1000; // Convert to seconds
            lastTime = now;
            if (!isVisible) return;
            time += deltaTime;

            // Clear with transparency to show page background
            ctx.clearRect(0, 0, width, height);

            // Rotation based on elapsed time (not frame count)
            const rotX = time * opts.rotVelX;
            const rotY = time * opts.rotVelY;

            cosX = Math.cos(rotX);
            sinX = Math.sin(rotX);
            cosY = Math.cos(rotY);
            sinY = Math.sin(rotY);

            // Update screen positions
            for (const conn of connections) {
                setScreen(conn);
                // Very slow, gentle firing effect (time-based)
                const firePhase = Math.sin(time * conn.glowSpeed * 0.8 + conn.x * 0.02) * 0.5 + 0.5;
                const isFiring = firePhase > 0.8;
                const hue = isFiring ? 190 : 270;
                const lightness = isFiring ? 65 : 40;
                const alpha = 0.5 + (1 - conn.screen.z / mostDistant) * 0.5;
                const saturation = isFiring ? 90 : 70;
                conn.screen.color = `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`;
                conn.screen.scale = isFiring ? conn.screen.scale * 1.2 : conn.screen.scale;
            }

            // Sort every other frame to reduce unnecessary allocations and CPU churn.
            if ((frameCount++ & 1) === 0) {
                connections.sort((a, b) => b.screen.z - a.screen.z);
            }
            const sorted = connections;

            // Draw connections (lines)
            ctx.globalCompositeOperation = "lighter";
            ctx.beginPath();
            ctx.lineWidth = 1;
            ctx.strokeStyle = "rgba(147, 100, 255, 0.35)";

            for (const conn of sorted) {
                for (const link of conn.links) {
                    ctx.moveTo(conn.screen.x, conn.screen.y);
                    ctx.lineTo(link.screen.x, link.screen.y);
                }
            }
            ctx.stroke();

            // Draw nodes with glow
            ctx.globalCompositeOperation = "source-over";
            ctx.shadowBlur = 15;
            ctx.shadowColor = "rgba(34, 211, 238, 0.6)";
            for (const conn of sorted) {
                ctx.fillStyle = conn.screen.color;
                ctx.beginPath();
                ctx.arc(conn.screen.x, conn.screen.y, conn.size * conn.screen.scale, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.shadowBlur = 0;

            // Draw root node - steady cyan with subtle pulse (time-based)
            const rootPulse = Math.sin(time * 0.4) * 0.5 + 0.5;
            const rootLight = 55 + rootPulse * 10;
            const rootSize = 1.5 + rootPulse * 0.1;
            const rootGlow = 30 + rootPulse * 15;
            ctx.fillStyle = `hsla(195, 90%, ${rootLight}%, 1)`;
            ctx.shadowBlur = rootGlow;
            ctx.shadowColor = "rgba(34, 211, 238, 0.85)";
            ctx.beginPath();
            ctx.arc(root.screen.x, root.screen.y, root.size * root.screen.scale * rootSize, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
        }

        animationRef.current = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener("resize", resize);
            visibilityObserver.disconnect();
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className={className}
            style={{ width: "100%", height: "100%" }}
        />
    );
}
