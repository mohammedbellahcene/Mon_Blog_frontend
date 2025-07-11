import React from "react";

type Props = {
  password: string;
};

const getStrength = (password: string) => {
  let score = 0;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score;
};

export const PasswordStrengthBar: React.FC<Props> = ({ password }) => {
  const score = getStrength(password);
  const colors = ["bg-red-500", "bg-orange-400", "bg-yellow-400", "bg-green-400", "bg-green-600"];
  return (
    <div className="w-full h-2 bg-gray-200 rounded mt-2">
      <div
        className={`h-2 rounded transition-all duration-300 ${colors[Math.max(0, score - 1)]}`}
        style={{ width: `${(score / 5) * 100}%` }}
      />
    </div>
  );
}; 