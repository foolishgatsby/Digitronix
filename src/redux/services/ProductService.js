import { BaseService } from "./BaseService";

class ProductService extends BaseService {
  getAllProduct = (page, limit) => {
    return this.get(`products/all?page=${page}&limit=${limit}`);
  };

  getAllProductNoPaging = () => {
    return this.get(`products/allNoPaging`);
  }

  searchProduct = (page, limit, keyword, category_id, tag) => {
    return this.get(
      `products/search?page=${page}&limit=${limit}&keyword=${keyword}&category_id=${category_id}&tag=${tag}`
    );
  };

  createProduct = (newProduct) => {
    // console.log("newProduct", newProduct);
    return this.post("products/create/info", newProduct);
  };

  // delete product
  deleteProduct = (id) => {
    return this.delete(`products/${id}`);
  }


  // edit product method
  editProduct = (editProduct) => {
    return this.put(`products/${editProduct.id}`, editProduct);
  }

  // get product by id
  getProductById = (id) => {
    return this.get(`products/${id}`);
  }

  // upload image
  uploadImage = (id, file) => {
    return this.post(`products/${id}/image`, file);
  }

}

export const productService = new ProductService();
