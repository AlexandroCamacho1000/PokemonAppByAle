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
    
    // ✅ useRef para evitar memory leak
    const isMounted = useRef(true);
    
    // Obtener datos
    const types = useSelector(state => {
        if (state.types?.allTypes) return state.types.allTypes;
        if (Array.isArray(state.types)) return state.types;
        return [];
    });
    
    // Estado del formulario
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
    
    // 1. CARGAR DATOS INICIALES - CORREGIDO para memory leak
    useEffect(() => {
        isMounted.current = true;
        
        const loadData = async () => {
            if (!isMounted.current) return;
            
            setLoading(true);
            try {
                // Cargar tipos si no están
                if (types.length === 0 && isMounted.current) {
                    await dispatch(getTypes());
                }
                
                // Cargar pokémon desde la API
                console.log(`🔍 Cargando Pokémon con ID: ${id}`);
                const response = await fetch(`http://localhost:3001/pokemons/${id}`);
                
                if (!response.ok) {
                    throw new Error('Pokémon no encontrado');
                }
                
                const pokemon = await response.json();
                console.log('📥 Pokémon cargado:', pokemon);
                
                // ✅ CORRECCIÓN IMPORTANTE: Verificar por UUID, no por campo 'created'
                // Tu modelo NO tiene campo 'created', así que verificamos por tipo de ID
                const isUUID = id.includes('-'); // UUID tiene guiones
                
                if (!isUUID) {
                    alert('Solo puedes editar pokémons creados por ti');
                    history.push(`/detail/${id}`);
                    return;
                }
                
                // ✅ Solo actualizar si componente está montado
                if (isMounted.current) {
                    // Llenar formulario
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
                    console.error('Error cargando datos:', error);
                    alert('Error: ' + error.message);
                    setLoading(false);
                    history.push('/home');
                }
            }
        };
        
        loadData();
        
        // ✅ CLEANUP FUNCTION para evitar memory leak
        return () => {
            isMounted.current = false;
        };
    }, [dispatch, id, history, types.length]);
    
    // 2. MANEJAR CAMBIOS
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
    
    // 3. VALIDACIÓN
    const validateForm = () => {
        const newErrors = {};
        
        if (!form.name.trim()) newErrors.name = 'Nombre requerido';
        if (!form.image.trim()) newErrors.image = 'Imagen requerida';
        if (form.hp < 1 || form.hp > 255) newErrors.hp = 'HP entre 1-255';
        if (form.attack < 1 || form.attack > 255) newErrors.attack = 'Ataque entre 1-255';
        if (form.defense < 1 || form.defense > 255) newErrors.defense = 'Defensa entre 1-255';
        if (form.types.length === 0) newErrors.types = 'Selecciona al menos 1 tipo';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    
    // 4. ENVIAR FORMULARIO (UPDATE) - CORREGIDO
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            alert('Por favor corrige los errores');
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
            
            // Añadir campos opcionales
            if (form.speed) pokemonData.speed = Number(form.speed);
            if (form.height) pokemonData.height = Number(form.height);
            if (form.weight) pokemonData.weight = Number(form.weight);
            
            console.log('📤 Enviando UPDATE para:', id);
            console.log('📦 Datos:', pokemonData);
            
            // ✅ Usar la acción de Redux pero con mejor manejo
            const idString = id.toString();
            const result = await dispatch(updatePokemon(idString, pokemonData));
            
            console.log('✅ Update exitoso:', result);
            
            alert('¡Pokémon actualizado exitosamente!');
            history.push(`/detail/${idString}`);
            
        } catch (error) {
            console.error('❌ Error en handleSubmit:', error);
            
            // ✅ MEJOR MANEJO DE ERRORES
            let errorMessage = 'Error actualizando Pokémon';
            
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.response?.data?.error) {
                errorMessage = error.response.data.error;
            } else if (error.message.includes('Solo se pueden actualizar')) {
                errorMessage = 'Solo puedes actualizar pokémons creados por ti';
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
                <h2>Cargando Pokémon...</h2>
            </div>
        );
    }
    
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Editar Pokémon</h1>
            <p className={styles.subtitle}>Modifica los datos de tu Pokémon</p>
            
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
                        placeholder="Nombre del Pokémon"
                        className={errors.name ? styles.errorInput : ''}
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
                            />
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
                            />
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
                            />
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
                    <button type="submit" className={styles.submitButton}>
                        💾 Guardar Cambios
                    </button>
                    <button 
                        type="button" 
                        className={styles.cancelButton}
                        onClick={() => history.push(`/detail/${id}`)}
                    >
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
}

export default EditForm;