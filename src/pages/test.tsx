import React from 'react';
import { 
  Typography, 
  Row, 
  Col, 
  Card, 
  Tag, 
  Divider, 
  Image, 
  Space, 
  Statistic 
} from 'antd';
import { 
  ClockCircleOutlined, 
  UserOutlined, 
  TagOutlined 
} from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const RecipeDetailPage = ({ recipe }) => {
  // Mock recipe data - replace with actual prop
  const mockRecipe = {
    name: "Chocolate Chip Cookies",
    description: "Classic homemade chocolate chip cookies that are crispy on the edges and soft in the center.",
    image: "/api/placeholder/600/400",
    servings: 24,
    totalTime: 45,
    prepTime: 15,
    cookTime: 30,
    categories: ["Dessert", "Baking"],
    tags: ["Quick", "Kid-Friendly", "Vegetarian"],
    ingredients: [
      "2 1/4 cups all-purpose flour",
      "1 tsp baking soda",
      "1 tsp salt",
      "1 cup butter, softened",
      "3/4 cup granulated sugar",
      "3/4 cup brown sugar",
      "1 tsp vanilla extract",
      "2 large eggs",
      "2 cups chocolate chips"
    ],
    instructions: [
      {
        stepName: "Prepare Ingredients",
        description: "Preheat oven to 375°F (190°C). Mix flour, baking soda, and salt in a bowl.",
        note: "Ensure ingredients are at room temperature"
      },
      {
        stepName: "Cream Butter and Sugars",
        description: "Beat butter, granulated sugar, brown sugar, and vanilla extract until creamy.",
        note: "Use an electric mixer for best results"
      },
      {
        stepName: "Add Eggs",
        description: "Add eggs one at a time, mixing well after each addition.",
        note: "Scrape down sides of the bowl"
      }
    ]
  };

  // Use the prop if provided, otherwise use mock data
  const recipeData = recipe || mockRecipe;

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '20px' }}>
      <Row gutter={[24, 24]}>
        {/* Image and Quick Stats */}
        <Col xs={24} md={10}>
          <Image 
            src={recipeData.image} 
            alt={recipeData.name}
            style={{ 
              width: '100%', 
              borderRadius: '12px', 
              objectFit: 'cover', 
              maxHeight: 400 
            }}
          />
        </Col>
        <Col xs={24} md={14}>
          <Title level={2}>{recipeData.name}</Title>
          <Paragraph>{recipeData.description}</Paragraph>
          
          <Row gutter={16}>
            <Col>
              <Statistic 
                title="Servings" 
                value={recipeData.servings} 
                prefix={<UserOutlined />} 
              />
            </Col>
            <Col>
              <Statistic 
                title="Total Time" 
                value={recipeData.totalTime} 
                suffix="mins" 
                prefix={<ClockCircleOutlined />} 
              />
            </Col>
            <Col>
              <Space>
                <Tag color="processing">Prep: {recipeData.prepTime} mins</Tag>
                <Tag color="processing">Cook: {recipeData.cookTime} mins</Tag>
              </Space>
            </Col>
          </Row>

          <Divider />

          {/* Categories and Tags */}
          <Space>
            <TagOutlined />
            {recipeData.categories.map(cat => (
              <Tag key={cat} color="geekblue">{cat}</Tag>
            ))}
            {recipeData.tags.map(tag => (
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
              {recipeData.ingredients.map((ingredient, index) => (
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
            {recipeData.instructions.map((instruction, index) => (
              <div 
                key={index} 
                style={{ 
                  marginBottom: '16px', 
                  padding: '12px', 
                  backgroundColor: '#fafafa', 
                  borderRadius: '8px' 
                }}
              >
                <Title level={5}>Step {index + 1}: {instruction.stepName}</Title>
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
    </div>
  );
};

export default RecipeDetailPage;