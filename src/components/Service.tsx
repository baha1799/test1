import http from "./common";
import crudData from "./type.crud"

class crudDataService {
  getAll() {
    return http.get<Array<crudData>>("/cruds");
  }

  get(id: string) {
    return http.get<crudData>(`/cruds/${id}`);
  }

  create(data: crudData) {
    return http.post<crudData>("/cruds", data);
  }

  update(data: crudData, id: any) {
    return http.put<any>(`/cruds/${id}`, data);
  }

  delete(id: any) {
    return http.delete<any>(`/cruds/${id}`);
  }

  deleteAll() {
    return http.delete<any>(`/cruds`);
  }

  findByTitle(titre: string) {
    return http.get<Array<crudData>>(`/cruds?titre=${titre}`);
  }
}

export default new crudDataService();