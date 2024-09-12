import React, { useState, useEffect } from 'react';
import './App.css';
import { FaPlus, FaMinus, FaEdit, FaTrash } from 'react-icons/fa';

function App() {
  const [celebrities, setCelebrities] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editMode, setEditMode] = useState(null);
  const [openId, setOpenId] = useState(null);
  const [editData, setEditData] = useState({});

  useEffect (()=>{
    // Fetch the celebrities data from JSON
    fetch('/celebrities.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => setCelebrities(data))
      .catch(error => console.error('Fetch error:', error));
    }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const toggleAccordion = (id) => {
    if (editMode) return; // Prevent changing accordion if in edit mode
    setOpenId(openId === id ? null : id);
  };

  const handleEdit = (celeb) => {
    setEditMode(celeb.id);
    setEditData({ ...celeb });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSave = (id) => {
    setCelebrities(prevCelebrities =>
      prevCelebrities.map(celeb =>
        celeb.id === id ? { ...editData } : celeb
      )
    );
    setEditMode(null);
  };

  const handleCancel = () => {
    setEditMode(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete?')) {
      setCelebrities(celebrities.filter(celeb => celeb.id !== id));
    }
  };

  const filteredCelebrities = celebrities.filter(celeb =>
    `${celeb.first} ${celeb.last}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="App">
      <input
        type="text"
        placeholder="Search Celebrity"
        value={searchTerm}
        onChange={handleSearch}
        className="search-bar"
      />
      {filteredCelebrities.map((celeb) => (
        <div key={celeb.id} className="accordion-item">
          <div className="accordion-header" onClick={() => toggleAccordion(celeb.id)}>
            <div className="accordion-title">
              <img src={celeb.picture || '/path-to-avatar.png'} alt={`${celeb.first} ${celeb.last}`} className="avatar" />
              <span>{celeb.first} {celeb.last}</span>
            </div>
            <div className="accordion-icon">
              {openId === celeb.id ? <FaMinus /> : <FaPlus />}
            </div>
          </div>
          {openId === celeb.id && (
            <div className="accordion-body">
              {editMode === celeb.id ? (
                <div className="edit-section">
                  <input
                    type="text"
                    value={`${celeb.first} ${celeb.last}`}
                    readOnly
                    className="input-field"
                  />
                  <input
                    type="text"
                    value={`${calculateAge(celeb.dob)} Years`}
                    readOnly
                    className="input-field"
                  />
                  <select
                    value={editData.gender}
                    name="gender"
                    onChange={handleInputChange}
                    className="input-field"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Transgender">Transgender</option>
                    <option value="Rather not say">Rather not say</option>
                    <option value="Other">Other</option>
                  </select>
                  <input
                    type="text"
                    value={editData.country}
                    name="country"
                    onChange={handleInputChange}
                    className="input-field"
                  />
                  <textarea
                    value={editData.description}
                    name="description"
                    onChange={handleInputChange}
                    className="input-field textarea"
                  />
                  <div className="action-buttons">
                    <button className="cancel-button" onClick={handleCancel}>Cancel</button>
                    <button
                      className="save-button"
                      onClick={() => handleSave(celeb.id)}
                      disabled={JSON.stringify(celeb) === JSON.stringify(editData)}
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <p><strong>Age:</strong> {calculateAge(celeb.dob)} Years</p>
                  <p><strong>Gender:</strong> {celeb.gender}</p>
                  <p><strong>Country:</strong> {celeb.country}</p>
                  <p><strong>Description:</strong> {celeb.description}</p>
                  <div className="actions">
                    <FaEdit onClick={() => handleEdit(celeb)} className="action-icon edit-icon" />
                    <FaTrash onClick={() => handleDelete(celeb.id)} className="action-icon delete-icon" />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default App;
