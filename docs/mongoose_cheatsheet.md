# A. Schema
## 1. SchemaTypes (Các kiểu dữ liệu)
|Kiểu dữ liệu|Mô tả  |
|------------|-------------------------------------------------------------------------------------------------|
|String      |"Chuỗi văn bản (VD: tên, email, mô tả)."                                                         |
|Number      |"Số thực hoặc số nguyên (VD: tuổi, giá cả)."                                                     |
|Boolean     |Giá trị đúng/sai (true/false).                                                                   |
|Date        |Ngày tháng thời gian.                                                                            |
|Buffer      |"Dữ liệu nhị phân (VD: ảnh, file dưới dạng code)."                                               |
|ObjectID    |Dùng để tham chiếu (Reference) đến một document khác qua _id.                                    |
|Array       |"Mảng các phần tử (có thể là mảng string, mảng number hoặc mảng object)."                        |
|Mixed       |"Kiểu ""tự do"", có thể chứa bất cứ thứ gì (nhưng hãy cẩn trọng vì nó bỏ qua kiểm tra Schema)."  |
|Map         |Kiểu dữ liệu dạng key-value linh hoạt.                                                           |


## 2. Các Option (Attributes) dùng chung
Hầu hết các kiểu dữ liệu đều có thể sử dụng các thuộc tính này:  

| Option         |      Mô tả                        |
|----------------|---------------------------|
|**required**    | Bắt buộc phải có dữ liệu. (VD: required: true hoặc required: [true, 'Phải nhập tên nha!']).  |
|**default**     | Giá trị mặc định nếu không nhập. |
|**select**      | Boolean, xác định xem trường này có tự động xuất hiện khi bạn dùng lệnh find() hay không (thường dùng để ẩn password).   |
|**validate**    | Hàm kiểm tra tùy chỉnh (custom validator) để check dữ liệu trước khi lưu.    |
|**alias**       | Đặt tên "biệt danh" cho trường dữ liệu để code dễ đọc hơn.   |
|**index**       | true. Tạo chỉ mục để tìm kiếm nhanh hơn.|
|**unique**      | true. Đảm bảo giá trị duy nhất trong Collection (Tạo Unique Index).|

## 3.Specific Options (Theo từng kiểu dữ liệu)
### String  

|           |                               |
|-----------|-------------------------------|
|lowercase  | Tự động chuyển về chữ thường. |
|uppercase  | Tự động chuyển về chữ hoa.    |
|trim       | Tự động xóa khoảng trắng ở 2 đầu chuỗi.   |
|match      | Kiểm tra theo biểu thức chính quy (Regex).    |
|enum       | Giới hạn giá trị trong một mảng (enum: ['admin', 'user']).    |
|minLength / maxLength  | Giới hạn độ dài chuỗi.    |

### Number & Date

**min / max**: Giá trị nhỏ nhất / lớn nhất cho phép.

### Logic Nâng Cao (Immutable, Get, Set)
|   |   |
|---|---|
|immutable  | true. Dữ liệu chỉ được ghi 1 lần lúc tạo, không thể update.|
|set        | Hàm biến đổi dữ liệu TRƯỚC khi lưu vào Database.|
|get        | Hàm biến đổi dữ liệu KHI lấy từ Database ra.|

## 4. Populate & Relationships
Sử dụng ref để liên kết các Collection.
```
const postSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User', // Trỏ đến Model User
    required: true
  }
});

// Khi Query:
// const post = await Post.find().populate('author');
```

## 5. Schema-Level Options (Transform & Timestamps)
Cấu hình nằm ở Object thứ 2 của hàm new Schema().

| | |
|--|--|
|timestamps        | true. Tự động thêm createdAt và updatedAt.|
|toJSON / toObject | Cấu hình cách chuyển đổi dữ liệu khi xuất bản.|
|getters           | true: Chạy các hàm get khi xuất dữ liệu.|
|virtuals          | true: Bao gồm các trường ảo (Virtuals).|
|transform         | Hàm tùy chỉnh Object đầu ra cuối cùng.|

## 6. Example
```
const userSchema = new Schema({
  username: {
    type: String,
    required: [true, 'Username là bắt buộc'],
    unique: true,
    trim: true,
    minLength: 3
  },
  email: {
    type: String,
    lowercase: true,
    immutable: true // Không cho phép đổi email
  },
  password: {
    type: String,
    select: false // Ẩn khỏi các câu lệnh find() thông thường
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user'
  },
  balance: {
    type: Number,
    // Lưu vào DB là số nguyên (đơn vị xu), nhưng lấy ra là số thập phân
    set: v => Math.round(v * 100),
    get: v => (v / 100).toFixed(2)
  }
}, {
  timestamps: true,
  toJSON: { 
    getters: true, 
    virtuals: true,
    transform: (doc, ret) => {
      delete ret._id; // Đổi _id thành id hoặc xóa bỏ tùy ý
      delete ret.__v;
      return ret;
    }
  }
});

// Trường ảo (Virtual) không lưu trong DB
userSchema.virtual('domain').get(function() {
  return this.email.split('@')[1];
});
```
# B. Operator

## 1. Query Selectors (Toán tử truy vấn)
Dùng trong các hàm như find(), findOne(), countDocuments().

### ⚖️ So sánh (Comparison)

|Toán tử|Ý nghĩa|Ví dụ|
|-------|-------|-----|
|$eq  |Bằng (Equal)|{ age: { $eq: 20 } }                 |
|$ne  |Không bằng (Not Equal)|{ role: { $ne: 'admin' } } |
|$gt  |Lớn hơn (Greater Than)|{ price: { $gt: 500 } }   |
|$gte |Lớn hơn hoặc bằng|{ score: { $gte: 8 } }     |
|$lt  |Nhỏ hơn (Less Than)|{ stock: { $lt: 10 } }   |
|$lte |Nhỏ hơn hoặc bằng|{ age: { $lte: 18 } }    |
|$in  |Nằm trong danh sách|"{ tags: { $in: ['node', 'react'] } }" |
|$nin |Không nằm trong danh sách|"{ status: { $nin: ['deleted', 'banned'] } }"    |

### 🧠 Logic

|Toán tử|Ý nghĩa|Ví dụ|
|-------|-------|-----|
|$and|Thỏa mãn tất cả điều kiện|"{ $and: [{ price: 10 }, { stock: 5 }] }"|
|$or|Thỏa mãn một trong các điều kiện|"{ $or: [{ role: 'admin' }, { vip: true }] }"|
|$not|Phủ định điều kiện|{ age: { $not: { $lt: 18 } } }|
|$nor|Không thỏa mãn tất cả|"{ $nor: [{ status: 'a' }, { status: 'b' }] }"|

## 2. Update Operators (Toán tử cập nhật)
Dùng trong updateOne(), updateMany(), findByIdAndUpdate().

### 📝 Trường dữ liệu (Fields)

|Toán tử |Ý nghĩa|Ví dụ|
|--------|-------|-----|
|$set|Ghi đè/Tạo mới giá trị|{ $set: { status: 'active' } }|
|$unset|Xóa bỏ một trường|"{ $unset: { temporaryData: """" } }"|
|$inc|Tăng/Giảm giá trị số|"{ $inc: { views: 1\| points: -5 } }"|
|$mul|Nhân giá trị số|{ $mul: { price: 1.1 } } (Tăng 10% giá trị)|
|$rename|Đổi tên trường|{ $rename: { 'oldName': 'newName' } }|
|$min / $max|Cập nhật nếu giá trị mới nhỏ/lớn hơn|{ $max: { highScore: 120 } }|
|upsert| Nếu tìm thấy thì cập nhật, nếu không tìm thấy thì tạo mới| {upsert: true}|

### 📚 Mảng (Arrays)

|Toán tử|Ý nghĩa|Ví dụ|
|-------|-------|-----|
|$push|Thêm phần tử vào cuối mảng|{ $push: { tags: 'new-tag' } }|
|$addToSet|Thêm nếu chưa tồn tại (tránh trùng)|{ $addToSet: { colors: 'red' } }|
|$pop|Xóa phần tử đầu (-1) hoặc cuối (1)|{ $pop: { images: 1 } }|
|$pull|Xóa các phần tử thỏa mãn điều kiện|{ $pull: { tags: 'old' } }|
|$pullAll|Xóa danh sách phần tử cụ thể|"{ $pullAll: { codes: [1 \| 2] } }" |
|$slice|Giới hạn số lượng phần tử mảng|Dùng kèm $push và $each|

## 3. Evaluation & Element (Toán tử đánh giá)

|Toán tử|Ý nghĩa|Ví dụ|
|-------|--------|----|
|$exists|Kiểm tra trường có tồn tại hay không|{ phone: { $exists: true } }|
|$type|Kiểm tra kiểu dữ liệu|"{ zipCode: { $type: ""string"" } }"|
|$regex|Tìm kiếm theo biểu thức chính quy|{ name: { $regex: /huy/i } }|
|$mod|Chia lấy dư (Modulo)|"{ age: { $mod: [2\| 0] } } (Tìm số chẵn)"|
|$text|Tìm kiếm toàn văn (Text Search)|"{ $text: { $search: ""coffee"" } }"|

## 4. Advanced Mongoose Operators

#### 1. Array Logic
- `$elemMatch`: Match sub-documents within an array.
- `$all`: Array must contain all specified elements.
- `$size`: Array length must match.

#### 2. Complex Update
- `$addToSet`: Add to array only if it doesn't exist (unique).
- `$[<identifier>]`: Update specific array elements using `arrayFilters`.
- `$inc`: Increment/Decrement (can be used for nested fields).

#### 3. Aggregation Powerful Tools
- `$lookup`: Left outer join to another collection.
- `$unwind`: Deconstruct an array field.
- `$facet`: Process multiple aggregation pipelines in a single stage (Great for Dashboards).

#### 4. Skip and limit in pagination
1. Ý nghĩa cơ bản
- limit(n): Giới hạn số lượng kết quả trả về tối đa là n.
- skip(m): Bỏ qua m kết quả đầu tiên và bắt đầu lấy từ vị trí $m + 1$.
**Công thức cơ bản cho phân trang:**  
Nếu bạn có số trang (page) và số lượng item trên mỗi trang (pageSize), công thức sẽ là:
- limit = pageSize
- skip = (page - 1) * pageSize

2. Vi du minh hoa
```
const pageSize = 10;
const page = 3;

const products = await Product.find()
  .sort({ createdAt: -1 }) // Thường đi kèm sort để thứ tự không bị nhảy
  .skip((page - 1) * pageSize) // Bỏ qua 20 mục đầu (trang 1 và 2)
  .limit(pageSize);            // Lấy 10 mục tiếp theo
```