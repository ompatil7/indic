import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./Signup.css";


const Signup = () => {
  const [formData, setFormData] = useState({
    fullname: '',
    username: '',
    email: '',
    password: '',
    age: '',
    nativeLanguage: '',
    learningLanguage: '',
    speciallyAbled: false,
  });
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [id]: type === 'checkbox' ? checked : value,
    }));
  };

  const validateFirstStep = () => {
    const { fullname, username, email, password, age } = formData;
    if (!fullname || !username || !email || !password || !age) {
      setError('Please fill in all fields');
      return false;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }
    setError('');
    return true;
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    if (validateFirstStep()) {
      setStep(2);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/signup', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Signup Successful: ' + data.message);
      } else {
        alert('Signup Failed: ' + data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred during signup.');
    }
  };

  return (
    <div>
      <header className="header">INDIC</header>
      <div className="signup-container">
        <h1>Signup</h1>
        {error && <div className="error-message" style={{color: 'red', textAlign: 'center'}}>{error}</div>}
        {step === 1 && (
          <form onSubmit={handleNextStep}>
            <div className="form-group">
              <label htmlFor="fullname">Full Name</label>
              <input
                type="text"
                id="fullname"
                value={formData.fullname}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={8}
              />
            </div>
            <div className="form-group">
              <label htmlFor="age">Age</label>
              <input
                type="number"
                id="age"
                value={formData.age}
                onChange={handleChange}
                required
                min={13}
              />
            </div>
            <button type="submit">Next</button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="nativeLanguage">Native Language</label>
              <select
                id="nativeLanguage"
                value={formData.nativeLanguage}
                onChange={handleChange}
                required
              >
                <option value="">Select Native Language</option>
                <option value="Hindi">Hindi</option>
                <option value="English">English</option>
                <option value="Marathi">Marathi</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="learningLanguage">Language to Learn</label>
              <select
                id="learningLanguage"
                value={formData.learningLanguage}
                onChange={handleChange}
                required
              >
                <option value="">Select Learning Language</option>
                <option value="Hindi">Hindi</option>
                <option value="English">English</option>
                <option value="Marathi">Marathi</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  id="speciallyAbled"
                  checked={formData.speciallyAbled}
                  onChange={handleChange}
                />
                Specially Abled
              </label>
            </div>
            <button type="submit" onClick={() => navigate('/login')}>Submit</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Signup;