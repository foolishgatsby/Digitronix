import { BaseService } from "./BaseService";

class SalaryService extends BaseService {
  getAllSalaries = () => {
    return this.get("salaries");
  };

  getSalaryById = (id) => {
    return this.get(`salaries/${id}`);
  };

  addSalary = (data) => {
    return this.post("salaries", data);
  };

  updateSalary = (data) => {
    return this.put(`salaries/${data.id}`, data);
  };

  deleteSalary = (id) => {
    return this.delete(`salaries/${id}`);
  };

  timekeeping = (data) => {
    // chấm công toàn bộ nhân viên
    return this.get(`salaries/timekeeping`);
  };
}

export const salaryService = new SalaryService();
