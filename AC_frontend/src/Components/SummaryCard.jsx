// components/SummaryCard.jsx
const SummaryCard = ({ title, value, bgColor, textColor }) => (
  <div className={`p-4 ${bgColor} ${textColor} rounded shadow`}>
    <h3 className="text-lg font-semibold">{title}</h3>
    <p className="text-2xl">{value}</p>
  </div>
);

export default SummaryCard;
