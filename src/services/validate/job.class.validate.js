const { isPhone } = require("../../helpers");
const companySchema = require("../../schemas/company.schema");
const occupationSchema = require("../../schemas/occupation.schema");
const userSchema = require("../../schemas/user.schema");

module.exports = {
    job_validate: class job_validate {
        constructor() { }
        async JobValidate(data) {
            const { name, description, requirement, hourWorking, postingDate, deadline, salary, locationWorking, idOccupation, idcompany } = data;
            const company = await companySchema.findById(idcompany)
            const occupation = await occupationSchema.findById(idOccupation)
            if ((name == undefined || name.length < 6)) { return ('name must longer 6 character'); }
            if (deadline == undefined || new Date(deadline) < new Date()) { return ('deadline failed!'); }
            if (locationWorking == undefined || locationWorking.length < 3) { return ('locationWorking must longer than 3 character failed!'); }
            if (salary == undefined || salary <= 0) { return ('salary must big than 0!'); }
            if (requirement == undefined || requirement.length <= 0) { return ('requirement is required'); }
            if (hourWorking == undefined || hourWorking.length <= 0) { return ('hourWorking is required'); }
            if (new Date(deadline) < new Date()) { return ('deadline failed!'); }
            if (occupation == null || occupation == undefined) { return ('occupation does not exists'); }
            if (company == null || company == undefined) { return ('company does not exists'); }
            return null;
        }
    },
    company_validate: class company_validate {
        constructor() { }
        async CompanyValidate(data) {
            const { name, totalEmployee, type, about, phone, location, idUser } = data;
            const user = await userSchema.findById(idUser)
            const companies = await companySchema.find({ name: name })
            if (companies.length > 0) { return ('company name is already exists!'); }
            if ((name == undefined || name.length < 3)) { return ('name must longer 6 character'); }
            if (phone == undefined || !isPhone(phone)) { return ('phone is incorrect!'); }
            if (idUser == undefined || user === null) { return ('idUser is undefined!'); }
            if (totalEmployee == undefined || totalEmployee <= 0) { return ('totalEmployee must big than 0!'); }
            if (type == undefined || type.length <= 0) { return ('type of company is required'); }
            if (about == undefined || about.length <= 0) { return ('about of company is required'); }
            if (location == undefined || location.length <= 0) { return ('location is required'); }
            return null;
        }
    }
}