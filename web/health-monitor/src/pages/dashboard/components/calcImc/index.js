import React, { useState, useEffect, useContext } from "react";
import "./styles.css";
import api from "../../../../services/api";
import IMCResult from "./ImcResult";
import { PostContext } from "../../../../context/PostContext";

function CalcImc() {
    const [height, setHeight] = useState();
    const [weight, setWeight] = useState();
    const { isPostSuccessful, setIsPostSuccessful } = useContext(PostContext);

    useEffect(() => {
        const pickMeasures = async () => {
            try {
                const { data } = await api.get("body-measure");
                const sortedBodyMeasure = data.sort(
                    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                );

                setHeight((sortedBodyMeasure[0].height / 100).toFixed(2));
                setWeight(sortedBodyMeasure[0].weight);
    
            } catch (error) {
                console.error("Erro ao buscar as medidas corporais:", error)
            }
        }

        if (isPostSuccessful || height === undefined || weight === undefined) {
            pickMeasures();
            setIsPostSuccessful(false);
        }

    }, [isPostSuccessful, setIsPostSuccessful, height, weight]);

    console.log("measure", height, weight)

    const imc = height && weight ? (weight / (height ** 2)).toFixed(1) : null;

    return (
        <div className="imc-calculator">
            <h2>Calculadora do IMC</h2>
            <div className="input-section">
                <div className="input-box height-box">
                    <p>Altura</p>
                    <h2>{height ? `${height} m` : 'Carregando...'}</h2>
                </div>
                <div className="input-box weight-box">
                    <p>Peso</p>
                    <h2>{weight ? `${weight} kg` : 'Carregando...'}</h2>
                </div>
            </div>
            {imc && <IMCResult imc={imc} />}
        </div>
    );


}

export default CalcImc;