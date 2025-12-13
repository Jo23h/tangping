function PrincipleList({ principles, onDelete, onItemClick }) {
  if (principles.length === 0) {
    return null;
  }

  const handlePrincipleClick = (principle) => {
    if (onItemClick) {
      onItemClick(principle);
    }
  };

  return (
    <div className='principle-list'>
      {principles.map((principle) => {
        return (
          <div
            key={principle.id}
            className='principle-item'
            onClick={() => handlePrincipleClick(principle)}
          >
            <span className='principle-tag'>{principle.tag}</span>
            <span className='principle-description'>{principle.description}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(principle.id);
              }}
              className='principle-delete-btn'
            >
              ×
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default PrincipleList;
