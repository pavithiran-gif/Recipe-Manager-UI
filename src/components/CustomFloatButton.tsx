import React from 'react';
import { Button } from 'antd';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';

const CustomFloatButton: React.FC = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/recipeform');
  };

  return (
    <Button
      type="primary"
      icon={<AddIcon />}
      onClick={handleClick} // Navigate on click
      style={{
        position: 'fixed',
        bottom: 16,
        right: 16,
        display: 'flex',
        alignItems: 'center',
        backgroundColor: 'black', // Black background
        borderColor: 'black', // Black border
        borderRadius: '24px', // Oval shape
        padding: '0 16px', // Horizontal padding for the oval effect
        height: '40px', // Height for proportion
      }}
    >
      Create
    </Button>
  );
};

export default CustomFloatButton;
