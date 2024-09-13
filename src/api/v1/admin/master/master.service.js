import constant from "../../../../constant/messages.js";

class CommonService {

    async create(model, metaData, query, moduleName) {
        let result = {};

        const existObj = await model.findOne({
            where: query,
        });

        if (existObj) {
            result = { status: 400, msg: constant.ALREADY_EXISTS.replace("<module>", moduleName) };
            return result;
        }

        const createdObj = await model.create(metaData);
        result = { status: 201, msg: constant.INSERT_SUCCESS, data: createdObj };
        return result;
    }

    async list(model, query) {
        let result = {};

        const docs = await model.findAll({
            where: query,
        });

        if (docs.length > 0) {
            result = { status: 200, msg: constant.DATA_FETCHED, data: docs };
            return result;
        }

        else {
            result = { status: 404, msg: constant.DATA_BLANK, data: docs };
            return result;
        }
    }

    async details(model, query) {
        let result = {};

        const doc = await model.findOne({
            where: query,
        });

        if (doc) {
            result = { status: 200, msg: constant.DATA_FETCHED, data: doc };
            return result;
        }

        else {
            result = { status: 404, msg: constant.DATA_BLANK, data: {} };
            return result;
        }
    }

    async update(model, updateMetaData, query) {
        let result = {};

        const [updated] = await model.update(updateMetaData, {
            where: query
        });

        if (updated) {
            result = { status: 202, msg: constant.UPDATE_SUCCESS.replace("<module>", "Data"), data: updated };
            return result;
        }

        else {
            result = { status: 202, msg: constant.UPDATE_FAILURE.replace("<module>", "Data"), data: {} };
            return result;
        }
    }

    async changeStatus(model, query) {
        let result = {};

        const doc = await model.findOne({
            where: query
        });

        if (doc) {
            let updateMetaData = { 'isActive': (!doc.isActive) ? 1 : 0 };
            let [updated] = await model.update(updateMetaData, { where: query });

            if(updated) {
                result = { status: 202, msg: constant.UPDATE_SUCCESS.replace("<module>", "Status"), data: {} };
                return result;
            }
            
            else {
                result = { status: 404, msg: constant.DATA_BLANK, data: {} };
                return result;
            }
        }

        else {
            result = { status: 404, msg: constant.DATA_BLANK, data: {} };
            return result;
        }
    }

    async delete(model, updateMetaData, query, moduleName) {
        let result = {};

        const [updated] = await model.update(updateMetaData, {
            where: query
        });

        if (updated) {
            result = { status: 200, msg: constant.DETAILS_DELETED.replace("<module>", moduleName), data: updated };
            return result;
        }

        else {
            result = { status: 404, msg: constant.DELETE_FAILURE.replace("<module>", "Data"), data: {} };
            return result;
        }
    }

    async count(model, query) {

        const count = await model.count({
            where: query,
        });

        return count;

    }

    async aggregate(model, aggregate) {
        let result = {};

        const docs = await model.findAll(aggregate);

        if (docs.length > 0) {
            result = { status: 200, msg: constant.DATA_FETCHED, data: docs };
            return result;
        }

        else {
            result = { status: 404, msg: constant.DATA_BLANK, data: docs };
            return result;
        }
    }

}

export default new CommonService();
