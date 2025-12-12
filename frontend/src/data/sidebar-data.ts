// Sidebar widget data - Random item shown from each list

export const sidebarData = {
    quotes: [
        { text: "Knowledge is data with context. Without context, it's just noise in the signal.", author: "Unknown" },
        { text: "The best code is no code at all. Every line of code you write is a line of code you'll have to debug.", author: "Jeff Atwood" },
        { text: "In the beginning there was nothing. Which exploded.", author: "Terry Pratchett" },
        { text: "Any sufficiently advanced technology is indistinguishable from magic.", author: "Arthur C. Clarke" },
    ],
    books: [
        { title: "The Pragmatic Programmer", author: "Hunt & Thomas" },
        { title: "Clean Code", author: "Robert C. Martin" },
        { title: "Neuromancer", author: "William Gibson" },
        { title: "Snow Crash", author: "Neal Stephenson" },
    ],
    films: [
        { title: "Blade Runner 2049", year: "2017" },
        { title: "Ghost in the Shell", year: "1995" },
        { title: "The Matrix", year: "1999" },
        { title: "Akira", year: "1988" },
    ],
    songs: [
        { title: "Resonance", artist: "HOME" },
        { title: "Midnight City", artist: "M83" },
        { title: "Nightcall", artist: "Kavinsky" },
    ],
};

// Get random item from array
export function getRandomItem<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}
