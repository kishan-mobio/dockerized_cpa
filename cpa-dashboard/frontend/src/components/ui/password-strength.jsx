'use client';

import { useState, useEffect } from 'react';

export const PasswordStrengthIndicator = ({ password }) => {
  const [strength, setStrength] = useState({
    score: 0,
    feedback: [],
    color: 'gray'
  });

  useEffect(() => {
    if (!password) {
      setStrength({ score: 0, feedback: [], color: 'gray' });
      return;
    }

    const feedback = [];
    let score = 0;

    // Length check
    if (password.length >= 8) {
      score += 1;
    } else {
      feedback.push('At least 8 characters');
    }

    // Lowercase check
    if (/[a-z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('One lowercase letter');
    }

    // Uppercase check
    if (/[A-Z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('One uppercase letter');
    }

    // Number check
    if (/\d/.test(password)) {
      score += 1;
    } else {
      feedback.push('One number');
    }

    // Special character check
    if (/[@$!%*?&]/.test(password)) {
      score += 1;
    } else {
      feedback.push('One special character (@$!%*?&)');
    }

    // Determine color based on score
    let color = 'gray';
    if (score >= 4) color = 'green';
    else if (score >= 3) color = 'yellow';
    else if (score >= 2) color = 'orange';
    else if (score >= 1) color = 'red';

    setStrength({ score, feedback, color });
  }, [password]);

  const getStrengthText = (score) => {
    if (score >= 4) return 'Strong';
    if (score >= 3) return 'Good';
    if (score >= 2) return 'Fair';
    if (score >= 1) return 'Weak';
    return 'Very Weak';
  };

  const getColorClasses = (color) => {
    switch (color) {
      case 'green':
        return 'bg-green-500';
      case 'yellow':
        return 'bg-yellow-500';
      case 'orange':
        return 'bg-orange-500';
      case 'red':
        return 'bg-red-500';
      default:
        return 'bg-gray-300';
    }
  };

  return (
    <div className="mt-2">
      {/* Strength bar */}
      <div className="flex space-x-1 mb-2">
        {[1, 2, 3, 4, 5].map((level) => (
          <div
            key={level}
            className={`h-1 flex-1 rounded ${
              level <= strength.score ? getColorClasses(strength.color) : 'bg-gray-200'
            }`}
          />
        ))}
      </div>

      {/* Strength text */}
      <div className="flex items-center justify-between text-xs">
        <span className={`font-medium ${
          strength.color === 'green' ? 'text-green-600' :
          strength.color === 'yellow' ? 'text-yellow-600' :
          strength.color === 'orange' ? 'text-orange-600' :
          strength.color === 'red' ? 'text-red-600' :
          'text-gray-500'
        }`}>
          {getStrengthText(strength.score)}
        </span>
        
        {strength.score < 4 && (
          <span className="text-gray-500">
            {strength.feedback.length > 0 && strength.feedback[0]}
          </span>
        )}
      </div>

      {/* Feedback list */}
      {strength.feedback.length > 0 && (
        <ul className="mt-1 text-xs text-gray-600 space-y-1">
          {strength.feedback.map((item, index) => (
            <li key={index} className="flex items-center">
              <span className="w-1 h-1 bg-red-400 rounded-full mr-2" />
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}; 