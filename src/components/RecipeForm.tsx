import React, { useState, useEffect } from "react";
import { Input, Button, Upload, Select, Divider, Space, Typography, Form, Row, Col, message } from "antd";
import { PlusOutlined, DeleteOutlined, UploadOutlined } from "@ant-design/icons";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { UploadFile } from "antd/es/upload/interface"; 
import axiosInstance from "../utils/axiosConfig";
import { useNavigate } from "react-router-dom";



const RecipeForm: React.FC = () => {
    const [ingredients, setIngredients] = useState([""]); // Initial empty ingredient
    const [instructions, setInstructions] = useState([{ stepName: "Step 1", description: "", note: "" }]);
    const [categories, setCategories] = useState<string[]>([]);
    const [tags, setTags] = useState<string[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [recipeName, setRecipeName] = useState("");
    const [Description, setDescription] = useState("");
    const [image, setImage] = useState<UploadFile | null>(null); // You can handle image uploading logic if needed
    const [servings, setServings] = useState<number | null>(null);
    const [totalTime, setTotalTime] = useState<number | null>(null);
    const [cookTime, setCookTime] = useState<number | null>(null);
    const [prepTime, setPrepTime] = useState<number | null>(null);
  
    const navigate = useNavigate();
  
  
    const handleImageUpload = (info: { file: UploadFile }) => {
      const file = info.file;
      
      // Validate file type and size
      const isImage = file.type?.startsWith('image/');
      const isLt6M = file.size ? file.size / 1024 / 1024 < 6 : false;
    
      if (!isImage) {
        message.error('You can only upload image files!');
        return;
      }
      if (!isLt6M) {
        message.error('Image must be smaller than 6MB!');
        return;
      }
    
      setImage(file);
    };
    
    useEffect(() => {
      const fetchCategoriesAndTags = async () => {
        try {
          const [categoriesResponse, tagsResponse] = await Promise.all([
            axiosInstance.get('/data/categories'),
            axiosInstance.get('/data/tags')
          ]);
          setCategories(categoriesResponse.data.map((cat: { CategoryName: string }) => cat.CategoryName));
          setTags(tagsResponse.data.map((tag: { TagName: string }) => tag.TagName));
        } catch (error) {
          console.error('Error fetching categories and tags:', error);
        }
      };
  
      fetchCategoriesAndTags();
    }, []);
    
  
    const handleIngredientChange = (index: number, value: string) => {
      const updatedIngredients = [...ingredients];
      updatedIngredients[index] = value;
      setIngredients(updatedIngredients);
    };
  
    const handleInstructionChange = (index: number, field: string, value: string) => {
      const updatedInstructions = [...instructions];
      updatedInstructions[index] = { ...updatedInstructions[index], [field]: value };
      setInstructions(updatedInstructions);
    };
  
    const handleAddIngredient = () => setIngredients([...ingredients, ""]);
    const handleAddInstruction = () => setInstructions([...instructions, { stepName: `Step ${instructions.length + 1}`, description: "", note: "" }]);
  
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleReorder = (result: any, type: "ingredients" | "instructions") => {
      if (!result.destination) return;
      if (type === "ingredients") {
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
  
    const handleAddCategory = async (newCategory: string) => {
      if (newCategory && !categories.includes(newCategory)) {
        try {
          await axiosInstance.post('/data/categories', { categoryName: newCategory });
          setCategories([...categories, newCategory]);
        } catch (error) {
          console.error('Error adding category:', error);
        }
      }
    };
  
    const handleAddTag = async (newTag: string) => {
      if (newTag && !tags.includes(newTag)) {
        try {
          await axiosInstance.post('/data/tags', { tagName: newTag });
          setTags([...tags, newTag]);
        } catch (error) {
          console.error('Error adding tag:', error);
        }
      }
    };
  
    const handleDiscard = () => {
      console.log("Discarding changes...");
      navigate("/recipes");
    };
  
  
    // Save Recipe function that calls the API
    const handleSaveRecipe = async () => {
      try {
        const formData = new FormData();
        
        // Add text data
        formData.append('recipeName', recipeName);
        formData.append('Description', Description);
        formData.append('ingredients', JSON.stringify(ingredients));
        formData.append('instructions', JSON.stringify(instructions));
        formData.append('categories', JSON.stringify(selectedCategories));
        formData.append('tags', JSON.stringify(selectedTags));
        if (servings !== null) formData.append('servings', servings.toString());
        if (totalTime !== null) formData.append('totalTime', totalTime.toString());
        if (cookTime !== null) formData.append('cookTime', cookTime.toString());
        if (prepTime !== null) formData.append('prepTime', prepTime.toString());
    
        // Add image if present
        if (image) {
          formData.append('image', image as unknown as File);
        }
    
        const response = await axiosInstance.post('/data/recipe', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true,
        });
    
        if (response.status === 200) {
          message.success('Recipe saved successfully!');
          navigate('/recipes'); // Optional: Reset form or navigate
          // Optional: Reset form or navigate
        }
      } catch (error) {
        console.error('Error saving recipe:', error);
        message.error('Failed to save recipe');
      }
    };
  
    return (
      <div style={{ padding: "20px" }}>
        <Typography.Title level={2}>Create Recipe</Typography.Title>
        <Form layout="vertical">
          {/* Recipe Name */}
          <Form.Item label="Recipe Name" required>
            <Input placeholder="Enter recipe name" value={recipeName}
              onChange={(e) => setRecipeName(e.target.value)}
  />
          </Form.Item>
  
          {/* Image Upload */}
          <Form.Item label="Recipe Image" valuePropName="file">
            <Upload listType="picture" maxCount={1} onChange={handleImageUpload} beforeUpload={() => false}>
              <Button icon={<UploadOutlined />}>Upload Image</Button>
            </Upload>
          </Form.Item>
  
          {/* Servings, Total Time, Cook Time, Prep Time */}
          <Space direction="horizontal" size="middle">
            <Form.Item label="Servings" required>
              <Input type="number" placeholder="Servings" min={1} value={servings ?? ''} onChange={(e) => setServings(Number(e.target.value))} />
            </Form.Item>
            <Form.Item label="Total Time (mins)">
              <Input type="number" placeholder="Total time" min={1} value={totalTime ?? ''} onChange={(e) => setTotalTime(Number(e.target.value))} />
            </Form.Item>
            <Form.Item label="Cook Time (mins)">
              <Input type="number" placeholder="Cook time" min={1} value={cookTime ?? ''} onChange={(e) => setCookTime(Number(e.target.value))} />
            </Form.Item>
            <Form.Item label="Preparation Time (mins)">
              <Input type="number" placeholder="Prep time" min={1} value={prepTime ?? ''} onChange={(e) => setPrepTime(Number(e.target.value))} />
            </Form.Item>
          </Space>
  
          {/* Description */}
          <Form.Item label="Description">
            <Input.TextArea rows={3} placeholder="Enter a brief description of the recipe" onChange={(e) => setDescription(e.target.value)}/>
          </Form.Item>
  
          {/* Ingredients */}
          <Form.Item label="Ingredients">
            <DragDropContext onDragEnd={(result) => handleReorder(result, "ingredients")}>
              <Droppable droppableId="ingredients">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef}>
                    {ingredients.map((ingredient, index) => (
                      <Draggable key={index} draggableId={`ingredient-${index}`} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              marginBottom: "8px",
                              ...provided.draggableProps.style,
                            }}
                          >
                            <Input
                              placeholder="Enter ingredient"
                              value={ingredient}
                              onChange={(e) => handleIngredientChange(index, e.target.value)}
                              style={{ flex: 1 }}
                            />
                            <Button
                              icon={<DeleteOutlined />}
                              type="text"
                              onClick={() =>
                                setIngredients(ingredients.filter((_, i) => i !== index))
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
            <Button onClick={handleAddIngredient} icon={<PlusOutlined />} style={{ marginTop: "8px" }}>
              Add Ingredient
            </Button>
          </Form.Item>
  
          {/* Categories */}
          <Form.Item label="Categories">
            <Select
              mode="multiple"
              placeholder="Select categories"
              onChange={(value) => setSelectedCategories(value)}
              options={categories.map((cat) => ({ label: cat, value: cat }))}
              dropdownRender={(menu) => (
                <>
                  {menu}
                  <Divider style={{ margin: "8px 0" }} />
                  <Space style={{ padding: "0 8px 4px" }}>
                    <Input
                      placeholder="Add category"
                      onPressEnter={(e) => handleAddCategory(e.currentTarget.value)}
                    />
                    <Button
                      type="text"
                      icon={<PlusOutlined />}
                      onClick={() =>
                        handleAddCategory((document.querySelector(".ant-input") as HTMLInputElement)?.value)
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
              options={tags.map((tag) => ({ label: tag, value: tag }))}
              dropdownRender={(menu) => (
                <>
                  {menu}
                  <Divider style={{ margin: "8px 0" }} />
                  <Space style={{ padding: "0 8px 4px" }}>
                    <Input
                      placeholder="Add tag"
                      onPressEnter={(e) => handleAddTag(e.currentTarget.value)}
                    />
                    <Button
                      type="text"
                      icon={<PlusOutlined />}
                      onClick={() =>
                        handleAddTag((document.querySelector(".ant-input") as HTMLInputElement)?.value)
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
            <DragDropContext onDragEnd={(result) => handleReorder(result, "instructions")}>
              <Droppable droppableId="instructions">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef}>
                    {instructions.map((instruction, index) => (
                      <Draggable key={index} draggableId={`instruction-${index}`} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={{
                              marginBottom: "8px",
                              border: "1px solid #ddd",
                              padding: "8px",
                              borderRadius: "4px",
                              backgroundColor: "#fafafa",
                              ...provided.draggableProps.style,
                            }}
                          >
                            <Input
                              placeholder="Step name"
                              value={instruction.stepName}
                              onChange={(e) =>
                                handleInstructionChange(index, "stepName", e.target.value)
                              }
                              style={{ marginBottom: "8px" }}
                            />
                            <Input.TextArea
                              rows={2}
                              placeholder="Description"
                              value={instruction.description}
                              onChange={(e) =>
                                handleInstructionChange(index, "description", e.target.value)
                              }
                            />
                            <Input.TextArea
                              rows={1}
                              placeholder="Footer note"
                              value={instruction.note}
                              onChange={(e) =>
                                handleInstructionChange(index, "note", e.target.value)
                              }
                              style={{ marginTop: "8px" }}
                            />
                            <Button
                              icon={<DeleteOutlined />}
                              type="text"
                              onClick={() =>
                                setInstructions(instructions.filter((_, i) => i !== index))
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
            <Button onClick={handleAddInstruction} icon={<PlusOutlined />} style={{ marginTop: "8px" }}>
              Add Instruction
            </Button>
          </Form.Item>
  
          {/* Action Buttons (Discard & Save) */}
          <Row justify="space-between" style={{ marginTop: "20px" }}>
            <Col>
              <Button onClick={handleDiscard}>Discard</Button>
            </Col>
            <Col>
              <Button type="primary" onClick={handleSaveRecipe}>Save Recipe</Button>
            </Col>
          </Row>
        </Form>
      </div>
    );
  };
  
  export default RecipeForm;
  