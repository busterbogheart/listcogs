"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongodb_1 = __importDefault(require("mongodb"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('*', (req, res) => {
    res.status(404).send('HIIIIIIII');
});
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const db = new mongodb_1.default.MongoClient(`mongodb+srv://kempet01:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_SERVER}/admin?authSource=admin&replicaSet=atlas-8104zh-shard-0&w=majority&readPreference=primary&retryWrites=true&ssl=true`);
        yield db.connect();
        app.listen(8000, () => {
            console.log('server up');
        });
    }
    catch (e) {
        console.error(e);
        process.exit();
    }
}))();
//# sourceMappingURL=index.js.map