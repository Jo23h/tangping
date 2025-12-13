import PrincipleList from '../PrincipleSection/PrincipleList';
import './PrinciplesPage.css';

function PrinciplesPage({ onItemClick, selectedItem, principles, onPrinciplesChange }) {
  const handleDeletePrinciple = (principleId) => {
    const updatedPrinciples = principles.filter(principle => principle.id !== principleId);
    onPrinciplesChange(updatedPrinciples);
  };

  return (
    <div className='principles-page-container'>
      <PrincipleList
        principles={principles}
        onDelete={handleDeletePrinciple}
        onItemClick={onItemClick}
      />
      {principles.length === 0 && (
        <div className='principles-page-empty'>
          No principles yet. Create principles in your projects.
        </div>
      )}
    </div>
  );
}

export default PrinciplesPage;
