import React from 'react';
import { useNavigate } from 'react-router-dom';
import QuotationList from 'QuotationList';
const QuotationPage = () => {
  const navigate = useNavigate();

  const handleCreateClick = () => {
    navigate('/quotations/create');
  };

  const handleRowClick = (quotationId) => {
    navigate(`/quotations/${quotationId}`);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Quotations</h2>
        <button
          onClick={handleCreateClick}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Create Quotation
        </button>
      </div>

      <QuotationList onRowClick={handleRowClick} />
    </div>
  );
};

export default QuotationPage;
