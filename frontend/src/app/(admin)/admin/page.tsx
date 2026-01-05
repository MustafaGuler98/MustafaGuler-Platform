'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

// Types
interface Article {
    id: string;
    title: string;
    slug: string;
    categoryName: string;
    languageCode: string;
}

interface Category {
    id: string;
    name: string;
    slug: string;
    description?: string;
}

interface ImageInfo {
    id: string;
    fileName: string;
    url: string;
    sizeBytes: number;
    createdDate: string;
    contentType: string;
    alt?: string;
    title?: string;
    uploadedByName?: string;
}

export default function AdminPage() {
    const { isAuthenticated, logout } = useAuth();
    const [message, setMessage] = useState('');

    // Tab state
    const [activeTab, setActiveTab] = useState<'articles' | 'categories' | 'images'>('articles');

    // Articles state
    const [articles, setArticles] = useState<Article[]>([]);
    const [articleForm, setArticleForm] = useState({ title: '', content: '', categoryId: '', languageCode: 'tr', mainImage: '' });
    const [editingArticleId, setEditingArticleId] = useState<string | null>(null);

    // Categories state
    const [categories, setCategories] = useState<Category[]>([]);
    const [categoryForm, setCategoryForm] = useState({ name: '', description: '' });
    const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);

    // Images state
    const [images, setImages] = useState<ImageInfo[]>([]);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imageName, setImageName] = useState('');

    // Styles
    const tabStyle = (active: boolean) => ({
        padding: '10px 20px',
        backgroundColor: active ? '#3b82f6' : '#1a1a2e',
        color: 'white',
        border: 'none',
        cursor: 'pointer',
        borderRadius: '4px 4px 0 0'
    });

    const btnStyle = { padding: '6px 12px', marginRight: '5px', cursor: 'pointer', border: 'none', borderRadius: '4px' };
    const inputStyle = { width: '100%', padding: '8px', marginBottom: '10px', fontSize: '14px' };

    // API calls
    const fetchArticles = async () => {
        try {
            const res = await fetch(`${API_URL}/articles/paged?pageSize=20`, {
                credentials: 'include'
            });
            const data = await res.json();
            setArticles(data.data || []);
        } catch { setMessage('Failed to fetch articles'); }
    };

    const fetchCategories = async () => {
        try {
            const res = await fetch(`${API_URL}/categories`, { credentials: 'include' });
            const data = await res.json();
            setCategories(data.data || []);
        } catch { setMessage('Failed to fetch categories'); }
    };

    const fetchImages = async () => {
        try {
            const res = await fetch(`${API_URL}/images?pageSize=20`, {
                credentials: 'include'
            });
            const data = await res.json();
            setImages(data.data || []);
        } catch { setMessage('Failed to fetch images'); }
    };

    // Fetch data based on active tab
    useEffect(() => {
        if (isAuthenticated) {
            if (activeTab === 'articles') {
                fetchArticles();
                fetchCategories();
            }
            if (activeTab === 'categories') fetchCategories();
            if (activeTab === 'images') fetchImages();
        }
    }, [isAuthenticated, activeTab]);

    // Article CRUD
    const handleArticleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const url = editingArticleId ? `${API_URL}/articles/${editingArticleId}` : `${API_URL}/articles`;
        const method = editingArticleId ? 'PUT' : 'POST';
        const body = editingArticleId ? { ...articleForm, id: editingArticleId } : articleForm;

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(body)
            });
            const data = await res.json();
            setMessage(data.message || (res.ok ? 'Success' : 'Error'));
            if (res.ok) {
                setArticleForm({ title: '', content: '', categoryId: '', languageCode: 'tr', mainImage: '' });
                setEditingArticleId(null);
                fetchArticles();
            }
        } catch { setMessage('Network error'); }
    };

    const deleteArticle = async (id: string) => {
        if (!confirm('Delete this article?')) return;
        try {
            const res = await fetch(`${API_URL}/articles/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            const data = await res.json();
            setMessage(data.message);
            fetchArticles();
        } catch { setMessage('Delete failed'); }
    };

    const editArticle = async (id: string) => {
        try {
            const res = await fetch(`${API_URL}/articles/id/${id}`, {
                credentials: 'include'
            });
            const data = await res.json();
            if (data.data) {
                setArticleForm({
                    title: data.data.title,
                    content: data.data.content,
                    categoryId: data.data.categoryId || '',
                    languageCode: data.data.languageCode,
                    mainImage: data.data.mainImage || ''
                });
                setEditingArticleId(id);
            }
        } catch { setMessage('Failed to load article'); }
    };

    // Category CRUD
    const handleCategorySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const url = editingCategoryId ? `${API_URL}/categories/${editingCategoryId}` : `${API_URL}/categories`;
        const method = editingCategoryId ? 'PUT' : 'POST';
        const body = editingCategoryId ? { ...categoryForm, id: editingCategoryId } : categoryForm;

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(body)
            });
            const data = await res.json();
            setMessage(data.message || (res.ok ? 'Success' : 'Error'));
            if (res.ok) {
                setCategoryForm({ name: '', description: '' });
                setEditingCategoryId(null);
                fetchCategories();
            }
        } catch { setMessage('Network error'); }
    };

    const deleteCategory = async (id: string) => {
        if (!confirm('Delete this category?')) return;
        try {
            const res = await fetch(`${API_URL}/categories/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            const data = await res.json();
            setMessage(data.message);
            fetchCategories();
        } catch { setMessage('Delete failed'); }
    };

    const editCategory = (cat: Category) => {
        setCategoryForm({ name: cat.name, description: cat.description || '' });
        setEditingCategoryId(cat.id);
    };

    // Image upload/delete
    const handleImageUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!imageFile) return;

        const formData = new FormData();
        formData.append('file', imageFile);
        formData.append('customName', imageName);

        try {
            const res = await fetch(`${API_URL}/images/upload`, {
                method: 'POST',
                credentials: 'include',
                body: formData
            });
            const data = await res.json();
            setMessage(data.message || (res.ok ? 'Uploaded' : 'Error'));
            if (res.ok) {
                setImageFile(null);
                setImageName('');
                fetchImages();
            }
        } catch (err: any) {
            console.error(err);
            setMessage(`Upload failed: ${err.message || 'Unknown error'}`);
        }
    };
    const deleteImage = async (id: string) => {
        if (!confirm('Delete this image?')) return;
        try {
            const res = await fetch(`${API_URL}/images/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            const data = await res.json();
            setMessage(data.message);
            fetchImages();
        } catch { setMessage('Delete failed'); }
    };

    // If not authenticated, we don't render anything (user should be redirected by middleware or just wait)
    // Or we can show a "Not Authorized" message if middleware failed for some reason
    if (!isAuthenticated) {
        return null;
    }

    // Admin panel
    return (
        <div style={{ maxWidth: '900px', margin: '20px auto', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h1>Admin Panel</h1>
                <button onClick={logout} style={{ ...btnStyle, backgroundColor: '#ef4444', color: 'white' }}>Logout</button>
            </div>

            {message && <div style={{ padding: '10px', backgroundColor: '#1a1a2e', marginBottom: '15px', borderRadius: '4px' }}>{message}</div>}

            {/* Tabs */}
            <div style={{ marginBottom: '20px' }}>
                <button style={tabStyle(activeTab === 'articles')} onClick={() => setActiveTab('articles')}>Articles</button>
                <button style={tabStyle(activeTab === 'categories')} onClick={() => setActiveTab('categories')}>Categories</button>
                <button style={tabStyle(activeTab === 'images')} onClick={() => setActiveTab('images')}>Images</button>
            </div>

            {/* Articles Tab */}
            {activeTab === 'articles' && (
                <div>
                    <h2>{editingArticleId ? 'Edit Article' : 'Add Article'}</h2>
                    <form onSubmit={handleArticleSubmit}>
                        <input placeholder="Title" value={articleForm.title} onChange={e => setArticleForm({ ...articleForm, title: e.target.value })} required style={inputStyle} />
                        <textarea placeholder="Content (Markdown)" value={articleForm.content} onChange={e => setArticleForm({ ...articleForm, content: e.target.value })} required style={{ ...inputStyle, height: '100px' }} />
                        <select value={articleForm.categoryId} onChange={e => setArticleForm({ ...articleForm, categoryId: e.target.value })} required style={inputStyle}>
                            <option value="">Select Category</option>
                            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                        <select value={articleForm.languageCode} onChange={e => setArticleForm({ ...articleForm, languageCode: e.target.value })} style={inputStyle}>
                            <option value="tr">TR</option>
                            <option value="en">EN</option>
                        </select>
                        <input placeholder="Main Image URL" value={articleForm.mainImage} onChange={e => setArticleForm({ ...articleForm, mainImage: e.target.value })} style={inputStyle} />
                        <button type="submit" style={{ ...btnStyle, backgroundColor: '#22c55e', color: 'white' }}>{editingArticleId ? 'Update' : 'Create'}</button>
                        {editingArticleId && <button type="button" onClick={() => { setEditingArticleId(null); setArticleForm({ title: '', content: '', categoryId: '', languageCode: 'tr', mainImage: '' }); }} style={btnStyle}>Cancel</button>}
                    </form>

                    <h3 style={{ marginTop: '20px' }}>Articles List</h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead><tr><th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #333' }}>Title</th><th>Slug</th><th>Category</th><th>Lang</th><th>Actions</th></tr></thead>
                        <tbody>
                            {articles.map(a => (
                                <tr key={a.id}>
                                    <td style={{ padding: '8px', borderBottom: '1px solid #333' }}>{a.title}</td>
                                    <td style={{ padding: '8px', borderBottom: '1px solid #333' }}>{a.slug}</td>
                                    <td style={{ padding: '8px', borderBottom: '1px solid #333' }}>{a.categoryName}</td>
                                    <td style={{ padding: '8px', borderBottom: '1px solid #333' }}>{a.languageCode}</td>
                                    <td style={{ padding: '8px', borderBottom: '1px solid #333' }}>
                                        <button onClick={() => editArticle(a.id)} style={{ ...btnStyle, backgroundColor: '#3b82f6', color: 'white' }}>Edit</button>
                                        <button onClick={() => deleteArticle(a.id)} style={{ ...btnStyle, backgroundColor: '#ef4444', color: 'white' }}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Categories Tab */}
            {activeTab === 'categories' && (
                <div>
                    <h2>{editingCategoryId ? 'Edit Category' : 'Add Category'}</h2>
                    <form onSubmit={handleCategorySubmit}>
                        <input placeholder="Name" value={categoryForm.name} onChange={e => setCategoryForm({ ...categoryForm, name: e.target.value })} required style={inputStyle} />
                        <input placeholder="Description" value={categoryForm.description} onChange={e => setCategoryForm({ ...categoryForm, description: e.target.value })} style={inputStyle} />
                        <button type="submit" style={{ ...btnStyle, backgroundColor: '#22c55e', color: 'white' }}>{editingCategoryId ? 'Update' : 'Create'}</button>
                        {editingCategoryId && <button type="button" onClick={() => { setEditingCategoryId(null); setCategoryForm({ name: '', description: '' }); }} style={btnStyle}>Cancel</button>}
                    </form>

                    <h3 style={{ marginTop: '20px' }}>Categories List</h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead><tr><th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #333' }}>Name</th><th>Slug</th><th>Description</th><th>Actions</th></tr></thead>
                        <tbody>
                            {categories.map(c => (
                                <tr key={c.id}>
                                    <td style={{ padding: '8px', borderBottom: '1px solid #333' }}>{c.name}</td>
                                    <td style={{ padding: '8px', borderBottom: '1px solid #333' }}>{c.slug}</td>
                                    <td style={{ padding: '8px', borderBottom: '1px solid #333' }}>{c.description}</td>
                                    <td style={{ padding: '8px', borderBottom: '1px solid #333' }}>
                                        <button onClick={() => editCategory(c)} style={{ ...btnStyle, backgroundColor: '#3b82f6', color: 'white' }}>Edit</button>
                                        <button onClick={() => deleteCategory(c.id)} style={{ ...btnStyle, backgroundColor: '#ef4444', color: 'white' }}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Images Tab */}
            {activeTab === 'images' && (
                <div>
                    <h2>Upload Image</h2>
                    <form onSubmit={handleImageUpload}>
                        <input type="file" accept=".jpg,.jpeg,.png" onChange={e => setImageFile(e.target.files?.[0] || null)} required style={inputStyle} />
                        <input placeholder="Custom name (without extension)" value={imageName} onChange={e => setImageName(e.target.value)} required style={inputStyle} />
                        <button type="submit" style={{ ...btnStyle, backgroundColor: '#22c55e', color: 'white' }}>Upload</button>
                    </form>

                    <h3 style={{ marginTop: '20px' }}>Images List</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '10px' }}>
                        {images.map((img) => (
                            <div key={img.id} style={{ border: '1px solid #333', padding: '10px', borderRadius: '4px' }}>
                                <img src={`${API_URL?.replace('/api', '')}${img.url}`} alt={img.alt || ''} style={{ width: '100%', height: '100px', objectFit: 'cover' }} />
                                <p style={{ fontSize: '12px', wordBreak: 'break-all' }}>{img.fileName}</p>
                                <p style={{ fontSize: '10px', color: '#888' }}>{(img.sizeBytes / 1024).toFixed(1)} KB</p>
                                <button onClick={() => deleteImage(img.id)} style={{ ...btnStyle, backgroundColor: '#ef4444', color: 'white', width: '100%' }}>Delete</button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
