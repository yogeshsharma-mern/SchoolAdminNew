const apiPath = Object.freeze({
  adminLogin: "/v1/admin/login",
  createAcademicSession: "/v1/admin/academicSession",
  getAcademicSessions: "/v1/admin/academicSession",
  updateAcademeicSession: "/v1/admin/academicSession",
  createSchoolSettings: "/v1/admin/school-setting",
  updateSchoolSettings: "/v1/admin/school-setting",
  getSchoolSettings: "/v1/admin/school-setting",
  getClasses: "/v1/admin/class/get/all",
  createClass: "/v1/admin/class/reg",
  updateClass: "/v1/admin/class",
  deleteClass: "/v1/admin/class/delete-class",
  getSections: "/v1/admin/class/get-sections",
  createSection: "/v1/admin/class/create-section",
  updateSection: "/v1/admin/class/update-section",
  deleteSection: "/v1/admin/class/delete-section",
  getAllSubjects: "/v1/admin/class/get/subjects",
  createSubject: "/v1/admin/class/subject/reg",
  updateSubject: "/v1/admin/class/subject",
  deleteSubject: "/v1/admin/class/delete/subject",

});

export default apiPath;


