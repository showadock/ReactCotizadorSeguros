import React, {useState} from 'react';
import styled from '@emotion/styled';
import { obtenerDiferenciaYear, calcularMarca, obtenerPlan } from '../helper';
import {PropTypes} from 'prop-types';


// INICIO STYLED COMPONENTS
const Campo = styled.div`

    display:flex;
    margin-bottom: 1rem;
    align-items: center;

`;

const Label = styled.div`

    flex: 0 0 100px;
`;

// webkit-appearance: Es la apariencia por default que tiene el componente html. Al quitarlo se le pueden cambiar sus estilos
const Select = styled.select`
    display: block;
    width: 100%;
    padding: 1rem;
    border: 1px solid #e1e1e1;
    -webkit-appearance:none;
`;


const Boton = styled.button`
    background-color:#00838f;
    font-size:16px;
    width:100%;
    padding: 1rem;
    color: #fff;
    text-transform: uppercase;
    font-weight: bold;
    border: none;
    transition: background-color .3s ease;
    margin-top: 2rem;

    &:hover{
        background-color: #26C6DA;
        cursor: pointer;
    }
`;


const InputRadio = styled.input`
    margin: 0 1rem;

`;

const Error = styled.div`
    background-color:red;
    color:white;
    padding:1rem;
    width:100%;
    text-align:center;
    margin-bottom: 2rem;

`;

// FIN STYLED COMPONENTS


// INICIO COMPONENTE
const Formulario =({guardarResumen, guardarCargando}) => {
    
    const [datos, guardarDatos] = useState({
        marca: '',
        year:'',
        plan:''
    })

    const [error, guardarError] = useState(false);
    
    // extraer valores
    const {marca, year, plan } = datos;

    // leer datos del form

    const obtenerInformacion = e => {
        guardarDatos({
            ...datos,
            [e.target.name] : e.target.value
        })
    }


    // Cuando se envian los datos
    const cotizarSeguro = e => {
        e.preventDefault();

        if (marca.trim() === '' || year.trim() === '' || plan.trim() ==='') {
            guardarError(true);
            return;
        }

        guardarError(false);
        
        // precio base 
        let resultado = 2000;


        // obtener diferencia de años 
        const diferencia = obtenerDiferenciaYear(year);
        console.log(diferencia);


        // por cada año restamos 3% del valor
        resultado -= ((diferencia * 3) * resultado) / 100;

        console.log(resultado);

        // Americano 15
        // Asiatico 5
        // Europepo 30
        resultado = calcularMarca(marca) * resultado;

        console.log(resultado);





        // Basico aumenta 20%
        // Completo 50%

        const incrementoPlan = obtenerPlan(plan);
        // parseamos a float el valor, y le dejamos solo 2 decimales
        resultado = parseFloat(incrementoPlan * resultado).toFixed(2);
        console.log(resultado);

        // Activa el spinner
        guardarCargando(true);

        
        setTimeout(()=>{

            // ELimina el spinner
            guardarCargando(false);
            
            // manda los datos al componente principal
            guardarResumen({
                cotizacion: resultado,
                datos
            });
        }, 3000)
        

    }
    
    return ( 

        <form
            onSubmit={cotizarSeguro}
            >
            { error ? <Error> Todos los campos son obligatorios</Error> : null}
            <Campo>
                <Label>Marca</Label>
                <Select
                    name="marca"
                    value={marca}
                    onChange={obtenerInformacion}>
                    <option value="">-- Seleccione -- </option>
                    <option value="americano">Americano</option>
                    <option value="europeo">Europeo</option>
                    <option value="asiatico">Asiatico</option>
                </Select>
            </Campo>

            <Campo>
                <Label>Año</Label>
                <Select
                name="year"
                value={year}
                onChange={obtenerInformacion}
                >
                    <option value="">-- Seleccione --</option>
                    <option value="2021">2021</option>
                    <option value="2020">2020</option>
                    <option value="2019">2019</option>
                    <option value="2018">2018</option>
                    <option value="2017">2017</option>
                    <option value="2016">2016</option>
                    <option value="2015">2015</option>
                    <option value="2014">2014</option>
                    <option value="2013">2013</option>
                    <option value="2012">2012</option>
                </Select>
            </Campo>

            <Campo>
                <Label>Plan</Label>
                <InputRadio 
                    type="radio" 
                    name="plan" 
                    value="basico" 
                    checked={plan=== "basico"}
                    onChange={obtenerInformacion} 
                    />Basico
                <InputRadio 
                    type="radio" 
                    name="plan" 
                    value="completo" 
                    checked={plan === "completo"}
                    onChange={obtenerInformacion} 
                    />Completo
            </Campo>

            <Boton type="submit">Cotizar</Boton>
        </form>
     );
}
 
Formulario.propTypes = {
    guardarResumen:  PropTypes.func.isRequired,
    guardarCargando: PropTypes.func.isRequired
}

export default Formulario;