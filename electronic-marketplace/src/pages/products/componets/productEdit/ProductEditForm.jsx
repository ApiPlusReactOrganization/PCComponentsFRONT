import React, { useCallback, useEffect, useState, memo } from "react";
import { useSelector } from "react-redux";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import useActions from "../../../../hooks/useActions";
import CategorySpecificFormForEdit from "./CategorySpecificFormForEdit";
import { categoryListSwitch } from "../productCreate/categoryListSwitch";
import { toast } from "react-toastify";
import TextBox from "../productCreate/TextBox";
import { useNavigate } from "react-router-dom";

const ProductEditForm = memo(() => {
  const { getCategories, getManufacturers, updateProduct } = useActions();
  const product = useSelector((state) => state.product.productForEdit);

  const navigate = useNavigate();

  useEffect(() => {
    getCategories();
    getManufacturers();
  }, []);

  useEffect(() => {
    if (product) {
      setSelectedCategory(product.category.name || "");
      setFormData({
        name: product.name || "",
        price: product.price || 0,
        description: product.description || "",
        stockQuantity: product.stockQuantity || 0,
        manufacturerId: product.manufacturer?.id || "",
        categoryId: product.category?.id || "",
        componentCharacteristic: product.componentCharacteristic || {},
      });
    }
  }, [product]);

  const categoryList = useSelector((state) => state.category.categoryList);
  const manufacturerList = useSelector(
    (state) => state.manufacturer.manufacturerList
  );

  const [selectedCategory, setSelectedCategory] = useState(
    product.categoryName || ""
  );

  const [formData, setFormData] = useState({
    name: product.name || "",
    price: product.price || 0,
    description: product.description || "",
    stockQuantity: product.stockQuantity || 0,
    manufacturerId: product.manufacturer.id || "",
    categoryId: product.category.id || "",
    componentCharacteristic: product.componentCharacteristic || {},
  });

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleCategoryChange = useCallback(
    (e) => {
      const category = e.target.value;
      const selectedCategoryObj = categoryList.find((c) => c.name === category);
      setSelectedCategory(category);
      setFormData((prev) => ({
        ...prev,
        categoryId: selectedCategoryObj ? selectedCategoryObj.id : "",
        componentCharacteristic: {},
      }));
    },
    [categoryList]
  );

  const handleCharacteristicChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setFormData((prev) => {
        const updatedCharacteristics = { ...prev.componentCharacteristic };
        updatedCharacteristics[categoryListSwitch(selectedCategory)] = {
          ...(updatedCharacteristics[categoryListSwitch(selectedCategory)] ||
            {}),
          [name]: value,
        };
        return { ...prev, componentCharacteristic: updatedCharacteristics };
      });
    },
    [selectedCategory]
  );

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const result = await updateProduct(product.id, formData);
      if (result.success) {
        navigate("/products");
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    },
    [updateProduct, formData, navigate]
  );

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 500 }}
    >
      <TextBox
        value={formData.name}
        onChange={handleInputChange}
        name={"name"}
        label={"Product Name"}
      />
      <TextField
        label="Price"
        type="number"
        name="price"
        value={formData.price}
        onChange={handleInputChange}
      />
      <TextField
        label="Description"
        name="description"
        value={formData.description}
        onChange={handleInputChange}
        multiline
        rows={4}
      />
      <TextField
        label="Stock Quantity"
        type="number"
        name="stockQuantity"
        value={formData.stockQuantity}
        onChange={handleInputChange}
      />
      <FormControl>
        <InputLabel id="manufacturer-label">Manufacturer</InputLabel>
        <Select
          labelId="manufacturer-label"
          label="Manufacturer"
          name="manufacturerId"
          value={formData.manufacturerId}
          onChange={handleInputChange}
        >
          <MenuItem value="">Select Manufacturer</MenuItem>
          {manufacturerList.map((manufacturer) => (
            <MenuItem key={manufacturer.id} value={manufacturer.id}>
              {manufacturer.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl>
        <InputLabel id="category-label">Category</InputLabel>
        <Select
          labelId="category-label"
          label="Category"
          value={selectedCategory}
          onChange={handleCategoryChange}
        >
          <MenuItem value="">Select Category</MenuItem>
          {categoryList.map((category) => (
            <MenuItem key={category.id} value={category.name}>
              {category.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {selectedCategory && (
        <CategorySpecificFormForEdit
          category={selectedCategory}
          onChange={handleCharacteristicChange}
          values={
            formData.componentCharacteristic[
              categoryListSwitch(selectedCategory)
            ] || {}
          }
        />
      )}
      <Button variant="contained" type="submit">
        Update Product
      </Button>
    </Box>
  );
});

export default ProductEditForm;
