import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { getTypes } from '../../redux/actions/typesActions';
import { createPokemon } from '../../redux/actions/pokemonActions';
import styles from './Form.module.css';

function Form() {
    const dispatch = useDispatch();
    const history = useHistory();
    
    // Obtener tipos desde Redux
    const types = useSelector(state => {
        // Manejar diferentes estructuras posibles
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
    
    // Cargar tipos al montar
    useEffect(() => {
        if (types.length === 0) {
            dispatch(getTypes());
        }
    }, [dispatch, types.length]);
    
    // Validaciones
    const validateField = (name, value) => {
        let error = '';
        
        switch (name) {
            case 'name':
                if (!value.trim()) error = 'Nombre requerido';
                else if (value.length > 20) error = 'Máximo 20 caracteres';
                break;
                
            case 'image':
                if (!value.trim()) error = 'URL de imagen requerida';
                else if (!value.startsWith('http')) error = 'Debe ser una URL válida';
                break;
                
            case 'hp':
            case 'attack':
            case 'defense':
                const num = Number(value);
                if (isNaN(num) || num < 1 || num > 255) {
                    error = 'Debe ser entre 1 y 255';
                }
                break;
                
            case 'types':
                if (value.length === 0) error = 'Selecciona al menos 1 tipo';
                else if (value.length > 2) error = 'Máximo 2 tipos';
                break;
        }
        
        return error;
    };
    
    // Manejar cambios en inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({
            ...form,
            [name]: value
        });
        
        // Validar en tiempo real
        const error = validateField(name, value);
        setErrors(prev => ({
            ...prev,
            [name]: error
        }));
    };
    
    // Manejar selección de tipos
    const handleTypeToggle = (typeName) => {
        setForm(prev => {
            let newTypes;
            if (prev.types.includes(typeName)) {
                newTypes = prev.types.filter(t => t !== typeName);
            } else if (prev.types.length < 2) {
                newTypes = [...prev.types, typeName];
            } else {
                newTypes = prev.types; // No hacer nada si ya tiene 2
            }
            
            // Validar tipos
            const error = validateField('types', newTypes);
            setErrors(prevErrors => ({
                ...prevErrors,
                types: error
            }));
            
            return { ...prev, types: newTypes };
        });
    };
    
    // Validar todo el formulario
    const validateForm = () => {
        const newErrors = {};
        
        // Validar cada campo
        Object.keys(form).forEach(key => {
            if (key === 'speed' || key === 'height' || key === 'weight') {
                // Campos opcionales, solo validar si tienen valor
                if (form[key] && (form[key] < 0 || form[key] > 999)) {
                    newErrors[key] = 'Valor inválido';
                }
            } else if (key !== 'types') {
                const error = validateField(key, form[key]);
                if (error) newErrors[key] = error;
            }
        });
        
        // Validar tipos
        const typesError = validateField('types', form.types);
        if (typesError) newErrors.types = typesError;
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    
    // Enviar formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            alert('Por favor corrige los errores en el formulario');
            return;
        }
        
        setLoading(true);
        
        try {
            // Preparar datos para enviar
            const pokemonData = {
                name: form.name.trim(),
                image: form.image.trim(),
                hp: Number(form.hp),
                attack: Number(form.attack),
                defense: Number(form.defense),
                types: form.types
            };
            
            // Añadir campos opcionales solo si tienen valor
            if (form.speed) pokemonData.speed = Number(form.speed);
            if (form.height) pokemonData.height = Number(form.height);
            if (form.weight) pokemonData.weight = Number(form.weight);
            
            console.log('Enviando Pokémon:', pokemonData);
            
            // Enviar al backend
            await dispatch(createPokemon(pokemonData));
            
            alert('¡Pokémon creado exitosamente!');
            history.push('/home');
            
        } catch (error) {
            console.error('Error al crear Pokémon:', error);
            alert(`Error: ${error.response?.data?.error || error.message || 'Error desconocido'}`);
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Crear Nuevo Pokémon</h1>
            <p className={styles.subtitle}>Todos los campos marcados con * son obligatorios</p>
            
            <form onSubmit={handleSubmit} className={styles.form}>
                {/* NOMBRE */}
                <div className={styles.formGroup}>
                    <label htmlFor="name">Nombre *</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Ej: Pikachu"
                        className={errors.name ? styles.errorInput : ''}
                        disabled={loading}
                    />
                    {errors.name && <span className={styles.errorText}>{errors.name}</span>}
                </div>
                
                {/* IMAGEN */}
                <div className={styles.formGroup}>
                    <label htmlFor="image">URL de la Imagen *</label>
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
                
                {/* STATS PRINCIPALES */}
                <div className={styles.statsSection}>
                    <h3>Estadísticas Principales *</h3>
                    <div className={styles.statsGrid}>
                        <div className={styles.formGroup}>
                            <label htmlFor="hp">Vida (HP)</label>
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
                            <label htmlFor="attack">Ataque</label>
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
                            <label htmlFor="defense">Defensa</label>
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
                
                {/* STATS OPCIONALES */}
                <div className={styles.statsSection}>
                    <h3>Estadísticas Opcionales</h3>
                    <div className={styles.statsGrid}>
                        <div className={styles.formGroup}>
                            <label htmlFor="speed">Velocidad</label>
                            <input
                                type="number"
                                id="speed"
                                name="speed"
                                value={form.speed}
                                onChange={handleChange}
                                min="0"
                                max="255"
                                placeholder="Opcional"
                                className={errors.speed ? styles.errorInput : ''}
                                disabled={loading}
                            />
                            {errors.speed && <span className={styles.errorText}>{errors.speed}</span>}
                        </div>
                        
                        <div className={styles.formGroup}>
                            <label htmlFor="height">Altura (cm)</label>
                            <input
                                type="number"
                                id="height"
                                name="height"
                                value={form.height}
                                onChange={handleChange}
                                min="0"
                                max="999"
                                placeholder="Opcional"
                                className={errors.height ? styles.errorInput : ''}
                                disabled={loading}
                            />
                            {errors.height && <span className={styles.errorText}>{errors.height}</span>}
                        </div>
                        
                        <div className={styles.formGroup}>
                            <label htmlFor="weight">Peso (kg)</label>
                            <input
                                type="number"
                                id="weight"
                                name="weight"
                                value={form.weight}
                                onChange={handleChange}
                                min="0"
                                max="999"
                                placeholder="Opcional"
                                className={errors.weight ? styles.errorInput : ''}
                                disabled={loading}
                            />
                            {errors.weight && <span className={styles.errorText}>{errors.weight}</span>}
                        </div>
                    </div>
                </div>
                
                {/* TIPOS */}
                <div className={styles.typesSection}>
                    <h3>Tipos * (Máximo 2)</h3>
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
                        <strong>Tipos seleccionados:</strong> {form.types.join(', ') || 'Ninguno'}
                    </div>
                </div>
                
                {/* BOTONES */}
                <div className={styles.buttons}>
                    <button 
                        type="submit" 
                        className={styles.submitButton}
                        disabled={loading}
                    >
                        {loading ? 'Creando...' : '✨ Crear Pokémon'}
                    </button>
                    
                    <button 
                        type="button" 
                        className={styles.cancelButton}
                        onClick={() => history.push('/home')}
                        disabled={loading}
                    >
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
}

export default Form;