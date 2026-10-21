# TopicLab — Interactive Topic Modeling Explorer (LSI, LDA & NMF)

Nền tảng phòng thí nghiệm tương tác (Interactive Academic Lab) phục vụ nghiên cứu, báo cáo học thuật và thuyết trình so sánh trực diện ba thuật toán Topic Modeling kinh điển:
- **LSI** (Latent Semantic Indexing / Truncated SVD)
- **LDA** (Latent Dirichlet Allocation / Bayesian Inference)
- **NMF** (Non-negative Matrix Factorization / Multiplicative Update)

---

## 1. Giới thiệu & Triết lý Thiết kế

TopicLab không phải là một dashboard trang trí tĩnh. Đây là một **phòng thí nghiệm tương tác khoa học**, sử dụng mô hình thật được huấn luyện từ Google Colab trên tập 20,000 bài báo tiếng Việt thực tế.

### Bảng màu quy ước học thuật:
- **LSI**: Xanh dương (`#2563eb`) — Đại số tuyến tính, hệ số mang dấu trực giao (+/-).
- **LDA**: Xanh lá (`#16a34a`) — Mô hình sinh xác suất Bayes, tổng xác suất bằng đúng 100%.
- **NMF**: Cam (`#ea580c`) — Phân rã ma trận thuần dương, độ thưa cao, biểu diễn từng phần (parts-based).

---

## 2. Cấu trúc Thư mục Dự án

```
d:\Projects\topiclab\
├── backend/
│   ├── artifacts/                  # Các file pickle & metadata xuất từ Colab
│   │   ├── count_vectorizer.pkl    # CountVectorizer (BoW) cho LDA
│   │   ├── tfidf_vectorizer.pkl    # TfidfVectorizer cho LSI & NMF
│   │   ├── lsi_model.pkl           # TruncatedSVD (k=10)
│   │   ├── lda_model.pkl           # LatentDirichletAllocation (k=10)
│   │   ├── nmf_model.pkl           # NMF (k=10, nndsvda)
│   │   ├── vn_stopwords.pkl        # Tập 192 hư từ tiếng Việt
│   │   └── metadata.json           # Thống kê và chỉ số đánh giá thực tế
│   ├── data/
│   │   └── sample_documents.json   # 15 bài báo tiếng Việt thực tế theo danh mục
│   └── app/
│       ├── config.py               # Cấu hình đường dẫn và tham số
│       ├── schemas.py              # Pydantic Schemas xác thực chặt chẽ
│       ├── main.py                 # FastAPI application, CORS, lifespan, SPA static mount
│       ├── services/
│       │   ├── loader.py           # Nạp một lần khi khởi động (Singleton)
│       │   ├── preprocessor.py     # Chuẩn hóa Unicode, tách từ ghép, kiểm tra OOV
│       │   ├── inference.py        # Suy luận thời gian thực cho 3 mô hình
│       │   ├── comparator.py       # Tính toán giao thoa từ khóa & đối chiếu trực diện
│       │   ├── evaluator.py        # Số liệu thực nghiệm Coherence, Diversity, Runtime
│       │   └── theory.py           # Dữ liệu lý thuyết toán học & trắc nghiệm hiểu bài
│       └── api/                    # Các route RESTful (/health, /documents, /analyze, /compare...)
│
├── frontend/
│   ├── src/
│   │   ├── types.ts                # TypeScript interfaces đồng bộ với backend
│   │   ├── api/client.ts           # HTTP client tương tác với FastAPI
│   │   ├── context/AppContext.tsx  # Global state: tài liệu chọn, kết quả so sánh, presentation
│   │   ├── components/
│   │   │   ├── Header.tsx          # Thanh điều hướng trên, trạng thái backend, nút thuyết trình
│   │   │   ├── Sidebar.tsx         # Sidebar phong cách academic lab
│   │   │   ├── Overview/           # Khu vực Tổng quan & Sơ đồ luồng End-to-End
│   │   │   ├── DocumentExplorer/   # Khám phá 15 bài báo mẫu & nhập văn bản tùy biến
│   │   │   ├── ModelExplorer/      # Khám phá chuyên sâu từng tab LSI, LDA, NMF
│   │   │   ├── ModelComparison/    # Giao diện 3 cột LSI | LDA | NMF đối đầu trực tiếp
│   │   │   ├── EvaluationLab/      # Đánh giá Coherence, Diversity, K-sweep, Benchmark table
│   │   │   ├── TheoryLab/          # Công thức toán, ký hiệu, ví dụ đồ chơi, câu hỏi hiểu bài
│   │   │   └── PresentationMode/   # Chế độ thuyết trình toàn màn hình cho màn chiếu
│   │   ├── App.tsx
│   │   └── index.css               # Tailwind CSS v4
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.app.json
└── README.md
```

---

## 3. Các Khu Vực Chức Năng Cốt Lõi

1. **Overview (Tổng quan)**:
   - Giới thiệu khái niệm Topic Modeling.
   - Thống kê ngữ liệu thực tế: 20,000 bài báo tiếng Việt, 10,000 từ vựng, 192 stopwords, 10 chủ đề.
   - Sơ đồ luồng xử lý tương tác từ Raw Text qua Tokenization đến Vectorization, Inference và Evaluation.

2. **Document Explorer (Khám phá tài liệu)**:
   - Danh sách 15 bài báo thời sự thực tế trải dài các chủ đề: Chính trị quốc tế, Giao thông, Giáo dục, Kinh tế, Quân sự, PCCC...
   - Quan sát văn bản sau tiền xử lý (các từ ghép tiếng Việt nối gạch dưới: `tổng_thống`, `triều_tiên`, `tai_nạn`).
   - Thước đo tỷ lệ khớp từ vựng (Vocabulary Overlap Rate) và cảnh báo khi văn bản chứa nhiều từ ngoài từ điển (OOV).
   - Form nhập văn bản mới tùy biến để kiểm tra trực tiếp.

3. **Model Explorer (Khám phá từng mô hình)**:
   - Ba tab riêng biệt: LSI, LDA, NMF.
   - Chọn Chủ đề 1 đến 10 để cập nhật danh sách top từ khóa và biểu đồ trọng số ngang.
   - Biểu diễn phân phối của văn bản đang chọn trên 10 chủ đề của từng mô hình.
   - Ghi chú khoa học và lưu ý diễn giải (tránh nhầm hệ số SVD hay trọng số NMF với xác suất).

4. **Model Comparison (So sánh đối đầu — Trọng tâm)**:
   - Giao diện 3 cột LSI | LDA | NMF song song trên cùng một văn bản.
   - Tự động phát hiện các từ khóa chung (Words in All 3 Models) và từ khóa riêng biệt của từng mô hình.
   - Hiển thị thời gian suy luận thực tế (Inference Latency) tính bằng mili-giây.
   - Chuyển đổi giữa chế độ Biểu đồ (Bar Chart) và Bảng dữ liệu (Data Table).

5. **Evaluation Lab (Đánh giá thực nghiệm)**:
   - Điểm Topic Coherence ($c_v$): NMF đạt **0.7861** (cao nhất), LDA đạt **0.6134**, LSI đạt **0.6050**.
   - Topic Diversity: NMF đạt **0.93** (93% từ khóa duy nhất không trùng lặp).
   - Đường cong K-Sweep: khảo sát Coherence khi thay đổi số lượng chủ đề $K \in [3, 5, 7, 10, 15]$.
   - Bảng 9 chỉ số đo lường đầy đủ thu được từ quá trình huấn luyện trên Google Colab.

6. **Theory Lab (Góc lý thuyết học thuật)**:
   - Công thức toán học đầy đủ ($A \approx U_k \Sigma_k V_k^T$, $\theta_d \sim \text{Dirichlet}(\alpha)$, $V \approx WH$).
   - Bảng tra cứu ý nghĩa từng ký hiệu toán học.
   - Ví dụ đồ chơi (Toy Example) minh họa trực quan.
   - Bảng cân đối Ưu điểm / Hạn chế và Bộ câu hỏi trắc nghiệm kiểm tra mức độ hiểu bài có phản hồi ngay.

7. **Presentation Mode (Chế độ thuyết trình màn chiếu)**:
   - Kịch bản demo 8 slide chuẩn mực từ Đặt vấn đề đến Kết luận & Khuyến nghị giải pháp.
   - Điều khiển bàn phím: dùng phím mũi tên `←` / `→` hoặc `Space` để chuyển slide, phím `Esc` để thoát.
   - Kích thước chữ và biểu đồ lớn, độ tương phản cao, tối ưu tuyệt đối cho máy chiếu lớp học.

---

## 4. Hướng Dẫn Cài Đặt & Khởi Chạy

### Yêu cầu môi trường:
- Python 3.10+ (Đã cấu hình tại virtual environment `d:\Projects\.venv`)
- Node.js 18+ và npm

### Cách 1: Khởi chạy Máy chủ Thống Nhất (Khuyến nghị)
FastAPI đã được tích hợp phục vụ cả REST API và Static Bundle React SPA:

```powershell
# Di chuyển vào thư mục backend
cd d:\Projects\topiclab\backend

# Khởi chạy FastAPI server
d:\Projects\.venv\Scripts\python.exe -m uvicorn app.main:app --host 127.0.0.1 --port 8000
```
- Mở trình duyệt tại: **http://127.0.0.1:8000/** để trải nghiệm trọn vẹn website.
- Tài liệu API tương tác Swagger UI: **http://127.0.0.1:8000/docs**

---

### Cách 2: Khởi chạy song song cho Phát triển (Dev Mode)
Nếu cần sửa đổi mã nguồn frontend và xem thay đổi tức thì (Hot Reload):

**Terminal 1 — Backend:**
```powershell
cd d:\Projects\topiclab\backend
d:\Projects\.venv\Scripts\python.exe -m uvicorn app.main:app --host 127.0.0.1 --port 8000
```

**Terminal 2 — Frontend:**
```powershell
cd d:\Projects\topiclab\frontend
npm run dev
```
- Mở giao diện dev tại: **http://127.0.0.1:3000/** (Vite tự động proxy các request `/api` sang port 8000).

---

## 5. Kết Quả Kiểm Thử Thực Tế

| Thành phần | Endpoint / Tính năng | Trạng thái | Ghi chú |
| :--- | :--- | :--- | :--- |
| **Health Check** | `GET /api/health` | **200 OK** | Nạp thành công cả 3 mô hình, 0 cảnh báo |
| **Documents API** | `GET /api/documents` | **200 OK** | Trả về 15 bài báo mẫu theo danh mục |
| **Inference API** | `POST /api/analyze` | **200 OK** | Thời gian suy luận: LSI ~25ms, NMF ~5ms, LDA ~3ms |
| **Comparison API** | `POST /api/compare` | **200 OK** | Trả về từ khóa chung và phân tích đồng thuận |
| **Evaluation API** | `GET /api/evaluation` | **200 OK** | Dữ liệu Coherence, Diversity, K-sweep từ Colab |
| **Theory API** | `GET /api/theory` | **200 OK** | Công thức, bảng ký hiệu và câu hỏi trắc nghiệm |
| **Presentation Mode** | Phím mũi tên `←`/`→` | **Hoạt động tốt** | Kịch bản 8 bước mượt mà, hỗ trợ reset demo |

---

## 6. Kết Luận Khoa Học Của Đề Tài

1. **NMF là thuật toán vượt trội nhất trên tập tin tức tiếng Việt**: Đạt điểm Topic Coherence ($c_v = 0.7861$) và Topic Diversity ($0.93$) cao nhất nhờ ràng buộc không âm loại bỏ hoàn toàn các trọng số âm gây nhiễu, cùng độ thưa 54.7% giúp chủ đề sắc nét và tập trung.
2. **LSI là thuật toán chạy nhanh nhất**: Tốc độ huấn luyện chỉ 0.71s, tối ưu sai số tái tạo Frobenius nhưng 47.5% hệ số âm khiến việc giải thích trực quan khó khăn.
3. **LDA là mô hình xác suất chặt chẽ nhất**: Đầu ra là phân phối xác suất hợp thức (tổng = 1.0), phân bố tài liệu đồng đều, nhưng chi phí suy luận biến phân rất lớn (thời gian huấn luyện 397s, chậm gấp 155 lần so với NMF).
