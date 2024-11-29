import React, { useState, useEffect } from 'react';
import {
  Form,
  Input,
  Button,
  Upload,
  Select,
  message,
  Divider,
  Space,
  Row,
  Col,
  Typography,
} from 'antd';
import { UploadOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosConfig';

const EditRecipe: React.FC = () => {
  const { recipeId } = useParams<{ recipeId: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [recipeName, setRecipeName] = useState('');
  const [Description, setDescription] = useState('');
  const [servings, setServings] = useState<number | undefined>();
  const [totalTime, setTotalTime] = useState<number | undefined>();
  const [cookTime, setCookTime] = useState<number | undefined>();
  const [prepTime, setPrepTime] = useState<number | undefined>();
  const [fileList, setFileList] = useState<any[]>([]);
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [instructions, setInstructions] = useState<
    { stepName: string; description: string; note?: string }[]
  >([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    // Fetch the recipe details
    const fetchRecipeDetails = async () => {
      try {
        const response = await axiosInstance.get(`/data/recipe/${recipeId}`);
        const recipeData = response.data;

        setRecipeName(recipeData.RecipeName || '');
        setDescription(recipeData.Description || '');
        setServings(recipeData.Servings || undefined);
        setTotalTime(recipeData.TotalTime || undefined);
        setCookTime(recipeData.CookTime || undefined);
        setPrepTime(recipeData.PrepTime || undefined);
        setIngredients(JSON.parse(recipeData.Ingredients || '[]'));
        setInstructions(JSON.parse(recipeData.Instructions || '[]'));
        setSelectedCategories(JSON.parse(recipeData.Categories || '[]'));
        setSelectedTags(JSON.parse(recipeData.Tags || '[]'));
        if (recipeData.ImagePath) {
          setFileList([
            {
              uid: '-1',
              name: 'recipe-image',
              status: 'done',
              url: `${import.meta.env.VITE_API_URL}${recipeData.ImagePath}`,
            },
          ]);
        }
      } catch (error) {
        message.error('Failed to load recipe details');
        console.error(error);
      }
    };

    fetchRecipeDetails();
  }, [recipeId]);

  const handleImageUpload = ({ fileList }: any) => setFileList(fileList);

  const handleAddIngredient = () => setIngredients([...ingredients, '']);
  const handleIngredientChange = (index: number, value: string) => {
    const updatedIngredients = [...ingredients];
    updatedIngredients[index] = value;
    setIngredients(updatedIngredients);
  };

  const handleAddInstruction = () =>
    setInstructions([
      ...instructions,
      { stepName: '', description: '', note: '' },
    ]);
  const handleInstructionChange = (
    index: number,
    field: 'stepName' | 'description' | 'note',
    value: string
  ) => {
    const updatedInstructions = [...instructions];
    updatedInstructions[index][field] = value;
    setInstructions(updatedInstructions);
  };

  const handleReorder = (
    result: any,
    type: 'ingredients' | 'instructions'
  ) => {
    if (!result.destination) return;
  
    if (type === 'ingredients') {
      const items = Array.from(ingredients);
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);
      setIngredients(items);
    } else {
      const items = Array.from(instructions);
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);
      setInstructions(items);
    }
  };

  const handleAddCategory = (value: string) => {
    if (value && !categories.includes(value)) {
      setCategories([...categories, value]);
    }
  };

  const handleAddTag = (value: string) => {
    if (value && !tags.includes(value)) {
      setTags([...tags, value]);
    }
  };

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));


  const handleSaveRecipe = async () => {
    try {
      const formData = new FormData();
      formData.append('recipeName', recipeName);
      formData.append('Description', Description);
      formData.append('servings', servings?.toString() || '');
      formData.append('totalTime', totalTime?.toString() || '');
      formData.append('cookTime', cookTime?.toString() || '');
      formData.append('prepTime', prepTime?.toString() || '');
      formData.append('ingredients', JSON.stringify(ingredients));
      formData.append('instructions', JSON.stringify(instructions));
      formData.append('categories', JSON.stringify(selectedCategories));
      formData.append('tags', JSON.stringify(selectedTags));

      if (fileList[0]?.originFileObj) {
        formData.append('image', fileList[0].originFileObj);
      }

      await axiosInstance.put(`/data/recipe/edit/${recipeId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      message.success('Recipe updated successfully');
      await delay(2000);
      navigate(`/recipe/${recipeId}`);
    } catch (error) {
      message.error('Failed to update recipe');
      console.error(error);
    }
  };

  const handleDiscard = () => navigate(-1);

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '20px' }}>
      <Typography.Title level={2}>Edit Recipe</Typography.Title>
      <Form layout="vertical">
        {/* Recipe Name */}
        <Form.Item label="Recipe Name" required>
          <Input
            placeholder="Enter recipe name"
            value={recipeName}
            onChange={(e) => setRecipeName(e.target.value)}
          />
        </Form.Item>

        {/* Image Upload */}
        <Form.Item label="Recipe Image" valuePropName="file">
          <Upload
            listType="picture"
            maxCount={1}
            onChange={handleImageUpload}
            beforeUpload={() => false}
            fileList={fileList}
          >
            <Button icon={<UploadOutlined />}>Upload Image</Button>
          </Upload>
        </Form.Item>

        {/* Servings, Total Time, Cook Time, Prep Time */}
        <Space direction="horizontal" size="middle">
          <Form.Item label="Servings" required>
            <Input
              type="number"
              placeholder="Servings"
              min={1}
              value={servings ?? ''}
              onChange={(e) => setServings(Number(e.target.value))}
            />
          </Form.Item>
          <Form.Item label="Total Time (mins)">
            <Input
              type="number"
              placeholder="Total time"
              min={1}
              value={totalTime ?? ''}
              onChange={(e) => setTotalTime(Number(e.target.value))}
            />
          </Form.Item>
          <Form.Item label="Cook Time (mins)">
            <Input
              type="number"
              placeholder="Cook time"
              min={1}
              value={cookTime ?? ''}
              onChange={(e) => setCookTime(Number(e.target.value))}
            />
          </Form.Item>
          <Form.Item label="Preparation Time (mins)">
            <Input
              type="number"
              placeholder="Prep time"
              min={1}
              value={prepTime ?? ''}
              onChange={(e) => setPrepTime(Number(e.target.value))}
            />
          </Form.Item>
        </Space>

        {/* Description */}
        <Form.Item label="Description">
          <Input.TextArea
            rows={3}
            placeholder="Enter a brief description of the recipe"
            value={Description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Item>

        {/* Ingredients */}
        <Form.Item label="Ingredients">
          <DragDropContext
            onDragEnd={(result) => handleReorder(result, 'ingredients')}
          >
            <Droppable droppableId="ingredients">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {ingredients.map((ingredient, index) => (
                    <Draggable
                      key={index}
                      draggableId={`ingredient-${index}`}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            marginBottom: '8px',
                            ...provided.draggableProps.style,
                          }}
                        >
                          <Input
                            placeholder="Enter ingredient"
                            value={ingredient}
                            onChange={(e) =>
                              handleIngredientChange(index, e.target.value)
                            }
                            style={{ flex: 1 }}
                          />
                          <Button
                            icon={<DeleteOutlined />}
                            type="text"
                            onClick={() =>
                              setIngredients(
                                ingredients.filter((_, i) => i !== index)
                              )
                            }
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
          <Button
            onClick={handleAddIngredient}
            icon={<PlusOutlined />}
            style={{ marginTop: '8px' }}
          >
            Add Ingredient
          </Button>
        </Form.Item>

        {/* Categories */}
        <Form.Item label="Categories">
          <Select
            mode="multiple"
            placeholder="Select categories"
            onChange={(value) => setSelectedCategories(value)}
            value={selectedCategories}
            options={categories.map((cat) => ({ label: cat, value: cat }))}
            dropdownRender={(menu) => (
              <>
                {menu}
                <Divider style={{ margin: '8px 0' }} />
                <Space style={{ padding: '0 8px 4px' }}>
                  <Input
                    placeholder="Add category"
                    onPressEnter={(e) => handleAddCategory(e.currentTarget.value)}
                  />
                  <Button
                    type="text"
                    icon={<PlusOutlined />}
                    onClick={() =>
                      handleAddCategory(
                        (
                          document.querySelector('.ant-input') as HTMLInputElement
                        )?.value
                      )
                    }
                  >
                    Add
                  </Button>
                </Space>
              </>
            )}
          />
        </Form.Item>

        {/* Tags */}
        <Form.Item label="Tags">
          <Select
            mode="multiple"
            placeholder="Select tags"
            onChange={(value) => setSelectedTags(value)}
            value={selectedTags}
            options={tags.map((tag) => ({ label: tag, value: tag }))}
            dropdownRender={(menu) => (
              <>
                {menu}
                <Divider style={{ margin: '8px 0' }} />
                <Space style={{ padding: '0 8px 4px' }}>
                  <Input
                    placeholder="Add tag"
                    onPressEnter={(e) => handleAddTag(e.currentTarget.value)}
                  />
                  <Button
                    type="text"
                    icon={<PlusOutlined />}
                    onClick={() =>
                      handleAddTag(
                        (
                          document.querySelector('.ant-input') as HTMLInputElement
                        )?.value
                      )
                    }
                  >
                    Add
                  </Button>
                </Space>
              </>
            )}
          />
        </Form.Item>

        {/* Instructions */}
        <Form.Item label="Instructions">
          <DragDropContext
            onDragEnd={(result) => handleReorder(result, 'instructions')}
          >
            <Droppable droppableId="instructions">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {instructions.map((instruction, index) => (
                    <Draggable
                      key={index}
                      draggableId={`instruction-${index}`}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{
                            marginBottom: '8px',
                            border: '1px solid #ddd',
                            padding: '8px',
                            borderRadius: '4px',
                            backgroundColor: '#fafafa',
                            ...provided.draggableProps.style,
                          }}
                        >
                          <Input
                            placeholder="Step name"
                            value={instruction.stepName}
                            onChange={(e) =>
                              handleInstructionChange(
                                index,
                                'stepName',
                                e.target.value
                              )
                            }
                            style={{ marginBottom: '8px' }}
                          />
                          <Input.TextArea
                            rows={2}
                            placeholder="Description"
                            value={instruction.description}
                            onChange={(e) =>
                              handleInstructionChange(
                                index,
                                'description',
                                e.target.value
                              )
                            }
                          />
                          <Input.TextArea
                            rows={1}
                            placeholder="Footer note"
                            value={instruction.note}
                            onChange={(e) =>
                              handleInstructionChange(index, 'note', e.target.value)
                            }
                            style={{ marginTop: '8px' }}
                          />
                          <Button
                            icon={<DeleteOutlined />}
                            type="text"
                            onClick={() =>
                              setInstructions(
                                instructions.filter((_, i) => i !== index)
                              )
                            }
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
          <Button
            onClick={handleAddInstruction}
            icon={<PlusOutlined />}
            style={{ marginTop: '8px' }}
          >
            Add Instruction
          </Button>
        </Form.Item>

        {/* Action Buttons (Discard & Save) */}
        <Row justify="space-between" style={{ marginTop: '20px' }}>
          <Col>
            <Button onClick={handleDiscard}>Discard</Button>
          </Col>
          <Col>
            <Button type="primary" onClick={handleSaveRecipe}>
              Save Recipe
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default EditRecipe;
