import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone } from '@fortawesome/free-solid-svg-icons';
import './VoiceDemo.css';

const VoiceDemo = () => {
  const examples = [
    {
      id: 1,
      command: '"Hey Walmart, add a can of diet coke to my cart"',
      description: 'Instantly adds Coca-Cola Diet Coke 12 oz Can for $1.48'
    },
    {
      id: 2,
      command: '"Hey Walmart, add 2 gallons of milk to my cart"',
      description: 'Adds Great Value Whole Milk 1 Gallon for $3.48 each'
    },
    {
      id: 3,
      command: '"Hey Walmart, add bread, eggs, and butter"',
      description: 'Adds multiple items in one command'
    }
  ];

  return (
    <section className="voice-demo">
      <div className="container">
        <h2>Voice Shopping Examples</h2>
        <div className="demo-examples">
          {examples.map(example => (
            <div key={example.id} className="example-card">
              <div className="example-icon">
                <FontAwesomeIcon icon={faMicrophone} />
              </div>
              <h3>{example.command}</h3>
              <p>{example.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VoiceDemo; 