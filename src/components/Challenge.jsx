import React from 'react';

function Challenge({ challenge, onSelectOption, selectedOption }) {
  return (
    <div className="challenge">
      <pre>{challenge.question}</pre>
      <ul>
        {challenge.options.map((option, index) => (
          <li key={index}>
            <label>
              <input
                type="radio"
                name="option"
                checked={selectedOption === index}
                onChange={() => onSelectOption(index)}
              />
              {option.text}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Challenge;