const jobSchema = require("../schemas/job.schema")

module.exports = {
    delete: async () => {
        var j = await jobSchema.find({})
            .populate('idCompany')
            .populate('idOccupation')
        var needDel = []
        for (let i of j) {
            if (i.idCompany == null || i.idOccupation == null) needDel.push(i._id)
        }
        await jobSchema.deleteMany({ _id: { $in: needDel } })
    }
}