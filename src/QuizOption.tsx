import React from 'react';

interface QuizOptionProps {
    name: string;
    value: string;
    onChange: () => void;
    label: React.JSX.Element;
    uniqKey: string
}
const QuizOption: React.FC<QuizOptionProps> = ({ name, value, onChange, label, uniqKey}) => {
    return (
        <div className="radio">
            <label className="form-check-label">
                <input
                    type="radio"
                    className="answerInput form-check-inline form-check-input"
                    id={uniqKey}
                    name={name}
                    value={value}
                    onChange={onChange}
                />
                <span className="ms-2">{label}</span>
            </label>
        </div>
    );
};

export default QuizOption;
