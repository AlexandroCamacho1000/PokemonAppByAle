import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { getTypes } from '../../redux/actions/typesActions';
import { createPokemon } from '../../redux/actions/pokemonActions';
import styles from './Form.module.css';

function Form() {
    const dispatch = useDispatch();
    const history = useHistory();
    
    const types = useSelector(state => {
        if (state.types?.allTypes) return state.types.allTypes;
        if (state.types?.types) return state.types.types;
        if (Array.isArray(state.types)) return state.types;
        return [];
    });
    
    const [form, setForm] = useState({
        name: '',
        image: '',
        hp: 50,
        attack: 50,
        defense: 50,
        speed: '',
        height: '',
        weight: '',
        types: []
    });
    
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        if (types.length === 0) {
            dispatch(getTypes());
        }
    }, [dispatch, types.length]);
    
    const validateField = (name, value) => {
        let error = '';
        
        switch (name) {
            case 'name':
                if (!value.trim()) error = 'Name required';
                else if (value.length > 20) error = 'Maximum 20 characters';
                break;
                
            case 'image':
                if (!value.trim()) error = 'Image URL required';
                else if (!value.startsWith('http')) error = 'Must be a valid URL';
                break;
                
            case 'hp':
            case 'attack':
            case 'defense':
                const num = Number(value);
                if (isNaN(num) || num < 1 || num > 255) {
                    error = 'Must be between 1 and 255';
                }
                break;
                
            case 'types':
                if (value.length === 0) error = 'Select at least 1 type';
                else if (value.length > 2) error = 'Maximum 2 types';
                break;
        }
        
        return error;
    };
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({
            ...form,
            [name]: value
        });
        
        const error = validateField(name, value);
        setErrors(prev => ({
            ...prev,
            [name]: error
        }));
    };
    
    const handleTypeToggle = (typeName) => {
        setForm(prev => {
            let newTypes;
            if (prev.types.includes(typeName)) {
                newTypes = prev.types.filter(t => t !== typeName);
            } else if (prev.types.length < 2) {
                newTypes = [...prev.types, typeName];
            } else {
                newTypes = prev.types;
            }
            
            const error = validateField('types', newTypes);
            setErrors(prevErrors => ({
                ...prevErrors,
                types: error
            }));
            
            return { ...prev, types: newTypes };
        });
    };
    
    const validateForm = () => {
        const newErrors = {};
        
        Object.keys(form).forEach(key => {
            if (key === 'speed' || key === 'height' || key === 'weight') {
                if (form[key] && (form[key] < 0 || form[key] > 999)) {
                    newErrors[key] = 'Invalid value';
                }
            } else if (key !== 'types') {
                const error = validateField(key, form[key]);
                if (error) newErrors[key] = error;
            }
        });
        
        const typesError = validateField('types', form.types);
        if (typesError) newErrors.types = typesError;
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            alert('Please fix form errors');
            return;
        }
        
        setLoading(true);
        
        try {
            const pokemonData = {
                name: form.name.trim(),
                image: form.image.trim(),
                hp: Number(form.hp),
                attack: Number(form.attack),
                defense: Number(form.defense),
                types: form.types
            };
            
            if (form.speed) pokemonData.speed = Number(form.speed);
            if (form.height) pokemonData.height = Number(form.height);
            if (form.weight) pokemonData.weight = Number(form.weight);
            
            console.log('Submitting Pokemon:', pokemonData);
            
            await dispatch(createPokemon(pokemonData));
            
            alert('Pokemon created successfully!');
            history.push('/home');
            
        } catch (error) {
            console.error('Error creating Pokemon:', error);
            alert(`Error: ${error.response?.data?.error || error.message || 'Unknown error'}`);
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Create New Pokemon</h1>
            <p className={styles.subtitle}>Fields marked with * are required</p>
            
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                    <label htmlFor="name">Name *</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Ex: Pikachu"
                        className={errors.name ? styles.errorInput : ''}
                        disabled={loading}
                    />
                    {errors.name && <span className={styles.errorText}>{errors.name}</span>}
                </div>
                
                <div className={styles.formGroup}>
                    <label htmlFor="image">Image URL *</label>
                    <input
                        type="text"
                        id="image"
                        name="image"
                        value={form.image}
                        onChange={handleChange}
                        placeholder="https://example.com/pokemon.png"
                        className={errors.image ? styles.errorInput : ''}
                        disabled={loading}
                    />
                    {errors.image && <span className={styles.errorText}>{errors.image}</span>}
                </div>
                
                <div className={styles.statsSection}>
                    <h3>Main Statistics *</h3>
                    <div className={styles.statsGrid}>
                        <div className={styles.formGroup}>
                            <label htmlFor="hp">HP</label>
                            <input
                                type="number"
                                id="hp"
                                name="hp"
                                value={form.hp}
                                onChange={handleChange}
                                min="1"
                                max="255"
                                className={errors.hp ? styles.errorInput : ''}
                                disabled={loading}
                            />
                            {errors.hp && <span className={styles.errorText}>{errors.hp}</span>}
                        </div>
                        
                        <div className={styles.formGroup}>
                            <label htmlFor="attack">Attack</label>
                            <input
                                type="number"
                                id="attack"
                                name="attack"
                                value={form.attack}
                                onChange={handleChange}
                                min="1"
                                max="255"
                                className={errors.attack ? styles.errorInput : ''}
                                disabled={loading}
                            />
                            {errors.attack && <span className={styles.errorText}>{errors.attack}</span>}
                        </div>
                        
                        <div className={styles.formGroup}>
                            <label htmlFor="defense">Defense</label>
                            <input
                                type="number"
                                id="defense"
                                name="defense"
                                value={form.defense}
                                onChange={handleChange}
                                min="1"
                                max="255"
                                className={errors.defense ? styles.errorInput : ''}
                                disabled={loading}
                            />
                            {errors.defense && <span className={styles.errorText}>{errors.defense}</span>}
                        </div>
                    </div>
                </div>
                
                <div className={styles.statsSection}>
                    <h3>Optional Statistics</h3>
                    <div className={styles.statsGrid}>
                        <div className={styles.formGroup}>
                            <label htmlFor="speed">Speed</label>
                            <input
                                type="number"
                                id="speed"
                                name="speed"
                                value={form.speed}
                                onChange={handleChange}
                                min="0"
                                max="255"
                                placeholder="Optional"
                                className={errors.speed ? styles.errorInput : ''}
                                disabled={loading}
                            />
                            {errors.speed && <span className={styles.errorText}>{errors.speed}</span>}
                        </div>
                        
                        <div className={styles.formGroup}>
                            <label htmlFor="height">Height (cm)</label>
                            <input
                                type="number"
                                id="height"
                                name="height"
                                value={form.height}
                                onChange={handleChange}
                                min="0"
                                max="999"
                                placeholder="Optional"
                                className={errors.height ? styles.errorInput : ''}
                                disabled={loading}
                            />
                            {errors.height && <span className={styles.errorText}>{errors.height}</span>}
                        </div>
                        
                        <div className={styles.formGroup}>
                            <label htmlFor="weight">Weight (kg)</label>
                            <input
                                type="number"
                                id="weight"
                                name="weight"
                                value={form.weight}
                                onChange={handleChange}
                                min="0"
                                max="999"
                                placeholder="Optional"
                                className={errors.weight ? styles.errorInput : ''}
                                disabled={loading}
                            />
                            {errors.weight && <span className={styles.errorText}>{errors.weight}</span>}
                        </div>
                    </div>
                </div>
                
                <div className={styles.typesSection}>
                    <h3>Types * (Maximum 2)</h3>
                    <div className={styles.typesContainer}>
                        {types.map(type => {
                            const typeName = typeof type === 'string' ? type : type.name;
                            const isSelected = form.types.includes(typeName);
                            
                            return (
                                <button
                                    key={typeName}
                                    type="button"
                                    onClick={() => handleTypeToggle(typeName)}
                                    className={`${styles.typeButton} ${isSelected ? styles.selected : ''}`}
                                    disabled={loading}
                                >
                                    {typeName.toUpperCase()}
                                </button>
                            );
                        })}
                    </div>
                    {errors.types && <span className={styles.errorText}>{errors.types}</span>}
                    <div className={styles.selectedTypes}>
                        <strong>Selected types:</strong> {form.types.join(', ') || 'None'}
                    </div>
                </div>
                
                <div className={styles.buttons}>
                    <button 
                        type="submit" 
                        className={styles.submitButton}
                        disabled={loading}
                    >
                        {loading ? 'Creating...' : '✨ Create Pokemon'}
                    </button>
                    
                    <button 
                        type="button" 
                        className={styles.cancelButton}
                        onClick={() => history.push('/home')}
                        disabled={loading}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}

export default Form;