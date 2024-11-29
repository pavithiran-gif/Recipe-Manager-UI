import React, { useState, useEffect } from 'react';
import { useParams, useNavigate  } from 'react-router-dom';
import axiosInstance from "../utils/axiosConfig";
import { 
  Typography, 
  Row, 
  Col, 
  Card, 
  Tag, 
  Divider, 
  Image, 
  Space, 
  Statistic,
  Spin,
  Alert,
  Button,
  Modal,
  message,
} from 'antd';
import { 
  ClockCircleOutlined, 
  UserOutlined, 
  TagOutlined,
  EditOutlined,
  DeleteOutlined, 
} from '@ant-design/icons';

const { Title, Paragraph } = Typography;


const RecipeDetail: React.FC = () => {
    const { recipeId } = useParams<{ recipeId: string }>();
    const [recipe, setRecipe] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

    const navigate = useNavigate();

  
    useEffect(() => {
      const fetchRecipeDetails = async () => {
        try {
          setIsLoading(true);
          const response = await axiosInstance.get(`/data/recipe/${recipeId}`);
          console.log('url link', response);
          
          // Parse complex fields
          const parsedRecipe = {
              ...response.data,
              ingredients: safeJsonParse(response.data.Ingredients),
              instructions: safeJsonParse(response.data.Instructions),
              categories: safeJsonParse(response.data.Categories),
              tags: safeJsonParse(response.data.Tags)  // Added tags parsing
            };
          setRecipe(parsedRecipe);
          setIsLoading(false);
        } catch (err) {
          console.error('Error fetching recipe details:', err);
          setError('Failed to load recipe details');
          setIsLoading(false);
        }
      };
  
      fetchRecipeDetails();
    }, [recipeId]);
  
    // Utility function for safe JSON parsing (from previous RecipeCard)
    const safeJsonParse = (jsonString, defaultValue = []) => {
      try {
        return typeof jsonString === 'string' ? JSON.parse(jsonString) : jsonString || defaultValue;
      } catch (error) {
        console.error('JSON Parsing Error:', error);
        return defaultValue;
      }
    };
  
    // Edit Recipe Handler
    const handleEditRecipe = () => {
      // Navigate to edit page for this specific recipe
      navigate(`/recipes/edit/${recipeId}`);
    };
  
    // Delete Recipe Handler
    const handleDeleteRecipe = async () => {
      try {
        await axiosInstance.delete(`/data/recipe/${recipeId}`);
        message.success('Recipe deleted successfully');
        navigate('/recipes'); // Redirect to recipes list after deletion
      } catch (err) {
        console.error('Error deleting recipe:', err);
        message.error('Failed to delete recipe');
      }
      setIsDeleteModalVisible(false);
    };
  
    // Confirmation Modal for Delete
    const showDeleteConfirmModal = () => {
      setIsDeleteModalVisible(true);
    };

    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-screen">
          <Spin size="large" />
        </div>
      );
    }
  
    if (error) {
      return (
        <div className="flex justify-center items-center h-screen">
          <Alert message="Error" description={error} type="error" />
        </div>
      );
    }
  
    if (!recipe) {
      return (
        <div className="flex justify-center items-center h-screen">
          <Alert message="No Recipe Found" type="warning" />
        </div>
      );
    }
  
    return (
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '20px' }}>
                {/* Action Buttons */}
                <div style={{ 
          display: 'flex', 
          justifyContent: 'flex-end', 
          marginBottom: '20px' 
        }}>
          <Space>
            <Button 
              icon={<EditOutlined />} 
              onClick={handleEditRecipe}
            >
              Edit Recipe
            </Button>
            <Button 
              danger 
              icon={<DeleteOutlined />} 
              onClick={showDeleteConfirmModal}
            >
              Delete Recipe
            </Button>
          </Space>
        </div>

        <Row gutter={[24, 24]}>
          {/* Image and Quick Stats */}
          <Col xs={24} md={10}>
            <Image 
              src={`${import.meta.env.VITE_API_URL}${recipe.ImagePath}`}
              alt={recipe.RecipeName}
              style={{ 
                width: '100%', 
                borderRadius: '12px', 
                objectFit: 'cover', 
                maxHeight: 400 
              }}
            />
          </Col>
          <Col xs={24} md={14}>
            <Title level={2}>{recipe.RecipeName}</Title>
            <Paragraph>{recipe.Description || 'No description available'}</Paragraph>
            
            <Row gutter={16}>
              <Col>
                <Statistic 
                  title="Servings" 
                  value={recipe.Servings} 
                  prefix={<UserOutlined />} 
                />
              </Col>
              <Col>
                <Statistic 
                  title="Total Time" 
                  value={recipe.TotalTime} 
                  suffix="mins" 
                  prefix={<ClockCircleOutlined />} 
                />
              </Col>
              <Col>
                <Space>
                  <Tag color="processing">Prep: {recipe.PrepTime || 'N/A'} mins</Tag>
                  <Tag color="processing">Cook: {recipe.CookTime || 'N/A'} mins</Tag>
                </Space>
              </Col>
            </Row>
  
            <Divider />
  
            {/* Categories Section */}
            <Space>
              <TagOutlined />
              {recipe.categories.map(cat => (
                <Tag key={cat} color="geekblue">{cat}</Tag>
              ))}
              {recipe.tags.map(tag => (
                <Tag key={tag} color="green">{tag}</Tag>
              ))}
            </Space>
          </Col>
  
          {/* Ingredients Section */}
          <Col xs={24} md={12}>
            <Card 
              title="Ingredients" 
              headStyle={{ backgroundColor: '#f0f2f5', borderBottom: 'none' }}
            >
              <ul style={{ 
                listStyleType: 'none', 
                padding: 0, 
                margin: 0 
              }}>
                {recipe.ingredients.map((ingredient, index) => (
                  <li 
                    key={index} 
                    style={{ 
                      padding: '8px 0', 
                      borderBottom: '1px solid #f0f0f0' 
                    }}
                  >
                    {ingredient}
                  </li>
                ))}
              </ul>
            </Card>
          </Col>
  
          {/* Instructions Section */}
          <Col xs={24} md={12}>
            <Card 
              title="Instructions" 
              headStyle={{ backgroundColor: '#f0f2f5', borderBottom: 'none' }}
            >
              {recipe.instructions.map((instruction, index) => (
                <div 
                  key={index} 
                  style={{ 
                    marginBottom: '16px', 
                    padding: '12px', 
                    backgroundColor: '#fafafa', 
                    borderRadius: '8px' 
                  }}
                >
                  <Title level={5}> {instruction.stepName}</Title>
                  <Paragraph>{instruction.description}</Paragraph>
                  {instruction.note && (
                    <Paragraph type="secondary" italic>
                      Note: {instruction.note}
                    </Paragraph>
                  )}
                </div>
              ))}
            </Card>
          </Col>
        </Row>
                {/* Delete Confirmation Modal */}
        <Modal
          title="Confirm Delete"
          visible={isDeleteModalVisible}
          onOk={handleDeleteRecipe}
          onCancel={() => setIsDeleteModalVisible(false)}
          okText="Yes, Delete"
          cancelText="No, Cancel"
          okButtonProps={{ danger: true }}
        >
          <p>Are you sure you want to delete this recipe? This action cannot be undone.</p>
        </Modal>
      </div>
    );
  };
  
  export default RecipeDetail;