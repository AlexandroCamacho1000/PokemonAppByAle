import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import { getTypes } from '../../redux/actions/typesActions';
import { updatePokemon } from '../../redux/actions/pokemonActions';
import styles from './EditForm.module.css';

function EditForm() {
    const { id } = useParams();
    const history = useHistory();
    const dispatch = useDispatch();
    
    const isMounted = useRef(true);
    
    const types = useSelector(state => {
        if (state.types?.allTypes) return state.types.allTypes;
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
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        isMounted.current = true;
        
        const loadData = async () => {
            if (!isMounted.current) return;
            
            setLoading(true);
            try {
                if (types.length === 0 && isMounted.current) {
                    await dispatch(getTypes());
                }
                
                console.log(`Loading Pokemon with ID: ${id}`);
                const response = await fetch(`http://localhost:3001/pokemons/${id}`);
                
                if (!response.ok) {
                    throw new Error('Pokemon not found');
                }
                
                const pokemon = await response.json();
                console.log('Pokemon loaded:', pokemon);
                
                const isUUID = id.includes('-');
                
                if (!isUUID) {
                    alert('Only user-created Pokemon can be edited');
                    history.push(`/detail/${id}`);
                    return;
                }
                
                if (isMounted.current) {
                    setForm({
                        name: pokemon.name || '',
                        image: pokemon.image || '',
                        hp: pokemon.hp || 50,
                        attack: pokemon.attack || 50,
                        defense: pokemon.defense || 50,
                        speed: pokemon.speed || '',
                        height: pokemon.height || '',
                        weight: pokemon.weight || '',
                        types: pokemon.types?.map(t => {
                            if (typeof t === 'string') return t;
                            if (t.name) return t.name;
                            if (t.type) return t.type.name;
                            return '';
                        }).filter(Boolean) || []
                    });
                    
                    setLoading(false);
                }
                
            } catch (error) {
                if (isMounted.current) {
                    console.error('Error loading data:', error);
                    alert('Error: ' + error.message);
                    setLoading(false);
                    history.push('/home');
                }
            }
        };
        
        loadData();
        
        return () => {
            isMounted.current = false;
        };
    }, [dispatch, id, history, types.length]);
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({
            ...form,
            [name]: value
        });
    };
    
    const handleTypeToggle = (typeName) => {
        setForm(prev => {
            if (prev.types.includes(typeName)) {
                return { ...prev, types: prev.types.filter(t => t !== typeName) };
            } else if (prev.types.length < 2) {
                return { ...prev, types: [...prev.types, typeName] };
            }
            return prev;
        });
    };
    
    const validateForm = () => {
        const newErrors = {};
        
        if (!form.name.trim()) newErrors.name = 'Name required';
        if (!form.image.trim()) newErrors.image = 'Image required';
        if (form.hp < 1 || form.hp > 255) newErrors.hp = 'HP between 1-255';
        if (form.attack < 1 || form.attack > 255) newErrors.attack = 'Attack between 1-255';
        if (form.defense < 1 || form.defense > 255) newErrors.defense = 'Defense between 1-255';
        if (form.types.length === 0) newErrors.types = 'Select at least 1 type';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            alert('Please fix errors');
            return;
        }
        
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
            
            console.log('Sending UPDATE for:', id);
            console.log('Data:', pokemonData);
            
            const idString = id.toString();
            const result = await dispatch(updatePokemon(idString, pokemonData));
            
            console.log('Update successful:', result);
            
            alert('Pokemon updated successfully!');
            history.push(`/detail/${idString}`);
            
        } catch (error) {
            console.error('Error in handleSubmit:', error);
            
            let errorMessage = 'Error updating Pokemon';
            
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.response?.data?.error) {
                errorMessage = error.response.data.error;
            } else if (error.message.includes('Only user-created Pokemon')) {
                errorMessage = 'Only user-created Pokemon can be updated';
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            alert(`Error: ${errorMessage}`);
        }
    };
    
    if (loading) {
        return (
            <div className={styles.loading}>
                <div className={styles.spinner}></div>
                <h2>Loading Pokemon...</h2>
            </div>
        );
    }
    
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Edit Pokemon</h1>
            <p className={styles.subtitle}>Modify your Pokemon data</p>
            
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                    <label htmlFor="name">Name *</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Pokemon name"
                        className={errors.name ? styles.errorInput : ''}
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
                            />
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
                            />
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
                            />
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
                    <button type="submit" className={styles.submitButton}>
                        💾 Save Changes
                    </button>
                    <button 
                        type="button" 
                        className={styles.cancelButton}
                        onClick={() => history.push(`/detail/${id}`)}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}

export default EditForm;