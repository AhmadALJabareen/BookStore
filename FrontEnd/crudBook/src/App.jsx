import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [books, setBooks] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    genre: '',
    publication_date: '',
    description: ''
  });
  const [editingBook, setEditingBook] = useState(null);

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.get('http://localhost:6001/books');
      setBooks(response.data);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBook) {
        await axios.put(`http://localhost:6001/books/${editingBook.book_id}`, formData);
      } else {
        await axios.post('http://localhost:6001/books', formData);
      }
      setFormData({
        title: '',
        author: '',
        genre: '',
        publication_date: '',
        description: ''
      });
      setEditingBook(null);
      fetchBooks();
    } catch (error) {
      console.error('Error saving book:', error);
    }
  };

  const handleEdit = (book) => {
    const formattedBook = {
      ...book,
      publication_date: formatDate(book.publication_date), // Format the date
    };
    setFormData(formattedBook);
    setEditingBook(book);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:6001/books/${id}`);
      fetchBooks();
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  };

  return (
    <div className="App">
      <h1>Book Manager</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="author"
          placeholder="Author"
          value={formData.author}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="genre"
          placeholder="Genre"
          value={formData.genre}
          onChange={handleInputChange}
        />
        <input
          type="date"
          name="publication_date"
          placeholder="Publication Date"
          value={formData.publication_date}
          onChange={handleInputChange}
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleInputChange}
        />
        <button type="submit">{editingBook ? 'Update' : 'Add'} Book</button>
      </form>
      <ul>
        {books.map((book) => (
          <li key={book.book_id}>
            <h2>{book.title}</h2>
            <p>{book.author}</p>
            <p>{book.genre}</p>
            <p>{book.publication_date}</p>
            <p>{book.description}</p>
            <button onClick={() => handleEdit(book)}>Edit</button>
            <button onClick={() => handleDelete(book.book_id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;