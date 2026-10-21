from typing import List, Dict, Any
from app.schemas import TheorySection, QuizQuestion

def get_theory_data() -> Dict[str, TheorySection]:
    """Provide comprehensive theoretical content for LSI, LDA, and NMF."""
    
    # 1. LSI
    lsi_theory = TheorySection(
        model_id="lsi",
        name="LSI",
        full_name="Latent Semantic Indexing (Chỉ mục ngữ nghĩa tiềm ẩn)",
        badge_color="#2563eb",
        intuition=(
            "Hãy tưởng tượng các từ như 'bác sĩ', 'bệnh viện', 'thuốc men' thường cùng xuất hiện trong các bài viết y tế. "
            "LSI sử dụng Đại số tuyến tính (SVD) để gom các từ hay đi cùng nhau vào các 'trục ngữ nghĩa ẩn'. "
            "Nhờ vậy, hai bài viết dùng các từ đồng nghĩa khác nhau vẫn có thể được nhận diện là cùng một chủ đề."
        ),
        toy_example={
            "description": "Xét ma trận Term-Document 3 từ × 3 văn bản: ['bác_sĩ', 'bệnh_viện', 'tên_lửa'].",
            "matrix_raw": [
                [1.0, 0.8, 0.0],
                [0.9, 1.0, 0.0],
                [0.0, 0.0, 1.2]
            ],
            "explanation": "Sau khi phân rã SVD với $k=2$, hai từ 'bác_sĩ' và 'bệnh_viện' được gộp vào Trục 1 (Y tế), còn 'tên_lửa' nằm trên Trục 2 (Quân sự). Phép chiếu giúp đo độ tương đồng góc cosine giữa các văn bản chính xác hơn so với không gian từ gốc."
        },
        processing_pipeline=[
            {"step": "1. Vector hóa TF-IDF", "detail": "Chuyển tập văn bản thành ma trận $A \\in \\mathbb{R}^{m \\times n}$ ($m$ từ vựng $\\times$ $n$ tài liệu) với trọng số TF-IDF."},
            {"step": "2. Phân rã Truncated SVD", "detail": "Phân rã ma trận thành tích đại số $A = U \\Sigma V^T$ với các vector riêng trực giao."},
            {"step": "3. Cắt giảm chiều k", "detail": "Chỉ giữ lại $k$ giá trị kỳ dị lớn nhất, thu được xấp xỉ tối ưu $A \\approx U_k \\Sigma_k V_k^T$."},
            {"step": "4. Biểu diễn tài liệu", "detail": "Chiếu tài liệu mới vào không gian $k$ chiều tiềm ẩn: $u_d = x_d V_k \\Sigma_k^{-1}$."}
        ],
        math_formulation={
            "main_equation": r"A_{m \times n} \approx U_k \Sigma_k V_k^T",
            "objective": r"\min_{\text{rank}(A_k)=k} \|A - A_k\|_F",
            "projection": r"u_d = x_d \cdot V_k \cdot \Sigma_k^{-1}"
        },
        symbol_table=[
            {"symbol": r"A_{m \times n}", "meaning": "Ma trận Term-Document kích thước $m$ (từ vựng) $\\times$ $n$ (tài liệu) chứa trọng số TF-IDF."},
            {"symbol": r"U_k", "meaning": "Ma trận trực giao $m \\times k$ chứa các vector riêng trái (mối quan hệ giữa từ vựng và chủ đề ẩn)."},
            {"symbol": r"\Sigma_k", "meaning": "Ma trận đường chéo $k \\times k$ chứa các giá trị kỳ dị (mức độ quan trọng của từng chiều ngữ nghĩa)."},
            {"symbol": r"V_k^T", "meaning": "Ma trận trực giao $k \\times n$ chứa các vector riêng phải (tọa độ của tài liệu trong không gian chủ đề)."},
            {"symbol": r"k", "meaning": "Số lượng chủ đề/thành phần ngữ nghĩa được chọn trước (trong thực nghiệm TopicLab, $k = 10$)."},
            {"symbol": r"\|A - A_k\|_F", "meaning": "Chuẩn Frobenius đo sai số tái tạo giữa ma trận gốc $A$ và ma trận xấp xỉ $A_k$."}
        ],
        pros=[
            "Tốc độ tính toán cực nhanh (~0.71s trên 20,000 tài liệu), thuật toán SVD đóng và tất định (deterministic).",
            "Giải quyết triệt để hiện tượng từ đồng nghĩa (synonymy) và một phần hiện tượng đa nghĩa (polysemy).",
            "Sai số tái tạo Frobenius tối ưu toán học theo Định lý Eckart-Young-Mirsky."
        ],
        cons=[
            "Chứa tới 47.5% hệ số âm: Tọa độ âm mang ý nghĩa trực giao hình học nhưng cực kỳ khó giải thích theo trực giác ngôn ngữ con người.",
            "Không phải mô hình xác suất: Các giá trị không bị chặn trong [0, 1] và không có tổng bằng 1.0.",
            "Topic Coherence đạt 0.6050, thấp hơn đáng kể so với NMF."
        ],
        platform_connection="Tại tab LSI trong TopicLab, biểu đồ hiển thị các giá trị tọa độ có thể âm hoặc dương. Khi chọn tài liệu thực nghiệm, tọa độ có độ lớn tuyệt đối cao nhất đại diện cho trục ngữ nghĩa chiếm ưu thế.",
        quiz=[
            QuizQuestion(
                id=1,
                question="Tại sao các hệ số trong ma trận thành phần của LSI lại có thể mang giá trị âm?",
                options=[
                    "Do lỗi thuật toán hoặc lỗi tiền xử lý dữ liệu.",
                    "Do phân rã SVD tìm các trục trực giao hình học để tối thiểu hóa sai số tái tạo, không áp đặt ràng buộc không âm.",
                    "Do ma trận TF-IDF ban đầu chứa các giá trị âm.",
                    "Do LSI sử dụng hàm phân phối chuẩn Gaussian với trung bình bằng 0."
                ],
                correct_index=1,
                explanation="SVD là phép biến đổi đại số tuyến tính tìm cơ sở trực giao trong không gian vector. Các vector riêng trực giao tự nhiên có các tọa độ âm và dương để biểu diễn hướng trong không gian."
            ),
            QuizQuestion(
                id=2,
                question="Hệ số của LSI có được gọi là 'Xác suất chủ đề' hay không?",
                options=[
                    "Có, chỉ cần chia cho tổng là thành xác suất.",
                    "Có, vì mọi mô hình Topic Modeling đều xuất ra xác suất.",
                    "Không, vì đây là tọa độ đại số tuyến tính trong không gian trực giao, có thể âm và không tuân theo các tiên đề xác suất Kolmogorov.",
                    "Có, nếu lấy giá trị tuyệt đối của các hệ số."
                ],
                correct_index=2,
                explanation="Hệ số LSI là tọa độ đại số tuyến tính có dấu. Gọi hệ số LSI là xác suất là sai lầm khoa học nghiêm trọng."
            )
        ]
    )

    # 2. LDA
    lda_theory = TheorySection(
        model_id="lda",
        name="LDA",
        full_name="Latent Dirichlet Allocation (Phân bổ Dirichlet tiềm ẩn)",
        badge_color="#16a34a",
        intuition=(
            "Hãy hình dung mỗi bài báo là một 'nồi lẩu' được nấu từ nhiều chủ đề theo tỷ lệ khác nhau "
            "(ví dụ: 60% Chính trị, 30% Quân sự, 10% Kinh tế). "
            "Mỗi chủ đề lại là một túi từ vựng với xác suất bốc trúng từ khác nhau. "
            "LDA dùng xác suất Bayes đảo ngược quá trình này: từ các từ quan sát được trong bài báo, suy luận ngược lại tỷ lệ các chủ đề."
        ),
        toy_example={
            "description": "Một bài báo quốc tế có 100 từ: 60 từ liên quan đến 'Trump, Nga, Nhà Trắng', 40 từ về 'tên lửa, Syria, tấn công'.",
            "matrix_raw": [
                [0.6, 0.4, 0.0],
                [0.0, 0.1, 0.9]
            ],
            "explanation": "LDA suy luận phân phối chủ đề của bài viết: $\\theta_d = [\\text{Chính trị: } 0.60, \\, \\text{Quân sự: } 0.40, \\, \\text{Thể thao: } 0.00]$. Tổng xác suất $\\sum \\theta_{dk} = 1.0$ (100%)."
        },
        processing_pipeline=[
            {"step": "1. Vector hóa đếm từ", "detail": "Dùng CountVectorizer (Bag-of-Words) lưu số lần xuất hiện nguyên của từng từ vựng."},
            {"step": "2. Khởi tạo tiên nghiệm", "detail": "Thiết lập phân phối Dirichlet cho chủ đề tài liệu ($\\alpha$) và từ trong chủ đề ($\\beta$)."},
            {"step": "3. Suy luận biến phân / Gibbs", "detail": "Lặp hàng chục vòng tối ưu hóa cận dưới ELBO để ước lượng phân phối hậu nghiệm."},
            {"step": "4. Xuất phân phối xác suất", "detail": "Thu được $\\theta_d$ (xác suất chủ đề của tài liệu) và $\\phi_k$ (xác suất từ trong từng chủ đề)."}
        ],
        math_formulation={
            "main_equation": r"P(W, Z, \theta, \phi \mid \alpha, \beta) = \prod_{k=1}^K P(\phi_k \mid \beta) \prod_{d=1}^D P(\theta_d \mid \alpha) \prod_{n=1}^{N_d} P(z_{dn} \mid \theta_d) P(w_{dn} \mid \phi_{z_{dn}})",
            "topic_dist": r"\theta_d \sim \text{Dirichlet}(\alpha), \quad \sum_{k=1}^K \theta_{dk} = 1",
            "word_dist": r"\phi_k \sim \text{Dirichlet}(\beta), \quad \sum_{v=1}^V \phi_{kv} = 1"
        },
        symbol_table=[
            {"symbol": r"\alpha", "meaning": "Siêu tham số Dirichlet kiểm soát độ tập trung của chủ đề trong mỗi tài liệu ($\\alpha$ nhỏ $\\to$ mỗi tài liệu ít chủ đề)."},
            {"symbol": r"\beta", "meaning": "Siêu tham số Dirichlet kiểm soát độ tập trung của từ trong mỗi chủ đề ($\\beta$ nhỏ $\\to$ mỗi chủ đề ít từ đặc trưng)."},
            {"symbol": r"\theta_d", "meaning": "Vector phân phối xác suất chủ đề của tài liệu $d$ (chiều $K$, tổng các phần tử $\\sum_{k=1}^K \\theta_{dk} = 1.0$)."},
            {"symbol": r"\phi_k", "meaning": "Vector phân phối xác suất của các từ vựng trong chủ đề $k$ (chiều $V$, tổng các phần tử $\\sum_{v=1}^V \\phi_{kv} = 1.0$)."},
            {"symbol": r"z_{dn}", "meaning": "Biến chủ đề ẩn được gán cho từ thứ $n$ trong tài liệu $d$."},
            {"symbol": r"w_{dn}", "meaning": "Từ quan sát được thứ $n$ trong tài liệu $d$."}
        ],
        pros=[
            "Cơ sở toán học xác suất chặt chẽ, tự nhiên và nhất quán.",
            "Đầu ra là xác suất thực sự (probabilities) trong đoạn [0, 1] với tổng bằng 1.0, rất dễ hiểu với người mới.",
            "Phân bố văn bản vào các chủ đề cân bằng và hài hòa nhất trong 3 mô hình."
        ],
        cons=[
            "Thời gian huấn luyện cực kỳ chậm: mất 397.7 giây (~6.6 phút) trên 20,000 văn bản, chậm gấp 155 lần so với NMF.",
            "Nhạy cảm cao với siêu tham số alpha và beta; thuật toán suy luận xấp xỉ biến phân có thể rơi vào cực tiểu cục bộ.",
            "Topic Coherence (0.6134) vẫn thấp hơn đáng kể so với NMF (0.7861) trên corpus báo tiếng Việt."
        ],
        platform_connection="Tại tab LDA và màn So sánh, biểu đồ hiển thị tỷ lệ phần trăm chính xác (tổng các cột luôn đúng 100%). Người dùng có thể quan sát trực tiếp xác suất gán chủ đề lớn nhất cho văn bản đang chọn.",
        quiz=[
            QuizQuestion(
                id=3,
                question="Tại sao đầu vào của mô hình LDA là CountVectorizer (đếm từ) thay vì TF-IDF?",
                options=[
                    "Vì scikit-learn chưa hỗ trợ TF-IDF cho LDA.",
                    "Vì LDA là mô hình sinh xác suất dựa trên quá trình đếm rời rạc (Multinomial / Poisson), đòi hỏi số nguyên tần suất từ.",
                    "Vì TF-IDF chạy quá chậm so với CountVectorizer.",
                    "Vì CountVectorizer tự động chuẩn hóa dữ liệu tốt hơn."
                ],
                correct_index=1,
                explanation="LDA mô hình hóa quá trình sinh văn bản bằng phân phối đa thức (Multinomial Distribution), trong đó mỗi từ là một sự kiện rời rạc bốc từ túi từ. Trọng số thực liên tục như TF-IDF phá vỡ giả định xác suất này."
            ),
            QuizQuestion(
                id=4,
                question="Đặc điểm quan trọng nhất của vector phân phối chủ đề theta_d trong LDA là gì?",
                options=[
                    "Tất cả các phần tử đều là số nguyên dương.",
                    "Các phần tử thuộc [0, 1] và tổng tất cả các phần tử của 10 chủ đề luôn bằng đúng 1.0.",
                    "Tích vô hướng giữa hai chủ đề bất kỳ luôn bằng 0.",
                    "Giá trị lớn nhất luôn vượt quá 0.5."
                ],
                correct_index=1,
                explanation="theta_d được rút ra từ phân phối Dirichlet trên simplex xác suất, đảm bảo mọi phần tử không âm và tổng xác suất của các chủ đề trong một tài liệu luôn bằng 1."
            )
        ]
    )

    # 3. NMF
    nmf_theory = TheorySection(
        model_id="nmf",
        name="NMF",
        full_name="Non-negative Matrix Factorization (Phân rã ma trận không âm)",
        badge_color="#ea580c",
        intuition=(
            "Hãy tưởng tượng vẽ một bức tranh bằng cách xếp các mảnh ghép lego: bạn chỉ có thể THÊM các mảnh ghép màu sắc vào, "
            "chứ không thể 'trừ đi' một mảnh ghép vô hình như trong SVD. "
            "Ràng buộc KHÔNG ÂM ($W \\ge 0, H \\ge 0$) buộc mô hình phải học các bộ phận ngữ nghĩa độc lập (additive parts-based), "
            "tạo ra các danh sách từ vựng cực kỳ sắc nét, sạch sẽ và hoàn toàn không bị nhiễu dấu âm."
        ),
        toy_example={
            "description": "Phân rã ma trận TF-IDF $V$ ($n \\times m$) thành tích của $W$ ($n \\times k$) và $H$ ($k \\times m$).",
            "matrix_raw": [
                [0.85, 0.00, 0.12],
                [0.00, 0.92, 0.05]
            ],
            "explanation": "Ma trận $H$ chứa top từ của từng chủ đề: 54.7% giá trị bằng 0 (độ thưa cao). Nhờ vậy, Chủ đề 'Hỏa hoạn' chỉ chứa trọng số dương cho ['cháy', 'lửa', 'cứu_hỏa'], tất cả các từ khác bằng đúng 0!"
        },
        processing_pipeline=[
            {"step": "1. Ma trận TF-IDF", "detail": "Xây dựng ma trận $V \\ge 0$ kích thước $n$ tài liệu $\\times$ $m$ từ vựng với các phần tử không âm."},
            {"step": "2. Khởi tạo NNDSVD", "detail": "Khởi tạo ma trận $W$ và $H$ bằng thuật toán SVD không âm (NNDSVDa) giúp hội tụ nhanh."},
            {"step": "3. Tối ưu hóa luân phiên", "detail": "Sử dụng Coordinate Descent luân phiên cập nhật $W$ và $H$ để tối thiểu hóa sai số Frobenius."},
            {"step": "4. Ràng buộc không âm", "detail": "Áp phép chiếu cắt cụt: $w_{ij} = \\max(0, w_{ij})$ triệt tiêu hoàn toàn giá trị âm."}
        ],
        math_formulation={
            "main_equation": r"V_{n \times m} \approx W_{n \times k} \times H_{k \times m}, \quad W \ge 0, \; H \ge 0",
            "objective": r"\min_{W \ge 0, \, H \ge 0} \frac{1}{2} \|V - WH\|_F^2",
            "update_rule": r"H_{kj} \leftarrow \max\left(0, \, \frac{(W^T V)_{kj}}{(W^T W H)_{kj}}\right)"
        },
        symbol_table=[
            {"symbol": r"V_{n \times m}", "meaning": "Ma trận TF-IDF đầu vào kích thước $n$ tài liệu $\\times$ $m$ từ vựng, các phần tử đều thỏa mãn $V_{ij} \\ge 0$."},
            {"symbol": r"W_{n \times k}", "meaning": "Ma trận tài liệu - chủ đề ($n \\times k$) chứa trọng số đóng góp của từng chủ đề vào từng tài liệu ($W \\ge 0$)."},
            {"symbol": r"H_{k \times m}", "meaning": "Ma trận chủ đề - từ vựng ($k \\times m$) chứa trọng số của từng từ trong từng chủ đề ($H \\ge 0$)."},
            {"symbol": r"k", "meaning": "Số chiều chủ đề tiềm ẩn (trong thực nghiệm TopicLab, $k = 10$)."},
            {"symbol": r"\|V - WH\|_F", "meaning": "Chuẩn Frobenius đo sai số tái tạo tổng thể giữa ma trận gốc $V$ và tích $W \\times H$."}
        ],
        pros=[
            "Topic Coherence đạt kỷ lục 0.7861 (vượt trội hoàn toàn so với LSI 0.6050 và LDA 0.6134).",
            "Topic Diversity cao nhất (0.93) và độ tương đồng Jaccard thấp nhất (0.0086) - các chủ đề hầu như không trùng lặp.",
            "Tốc độ huấn luyện rất nhanh: chỉ 2.57 giây trên 20,000 văn bản (nhanh hơn LDA 155 lần).",
            "Độ thưa 54.7% trong H giúp việc giải thích ý nghĩa chủ đề cực kỳ tự nhiên, loại bỏ hoàn toàn nhiễu dấu âm của LSI."
        ],
        cons=[
            "Bài toán tối ưu không lồi (non-convex), nghiệm tìm được là cực tiểu cục bộ tùy thuộc vào điểm khởi tạo (được khắc phục nhờ NNDSVDa).",
            "Trọng số W gốc không phải xác suất: cần chuẩn hóa L1 chia cho tổng hàng nếu muốn biểu diễn dưới dạng tỷ lệ phần trăm."
        ],
        platform_connection="Tại tab NMF và màn So sánh, các biểu đồ thể hiện các trọng số thuần dương. NMF mang lại danh sách từ khóa trực quan, tập trung và dễ hiểu nhất trong cả 3 thuật toán.",
        quiz=[
            QuizQuestion(
                id=5,
                question="Tại sao NMF lại đạt Topic Coherence (0.7861) và Topic Diversity (0.93) cao vượt trội so với LSI và LDA trên tập tin tức tiếng Việt?",
                options=[
                    "Vì NMF sử dụng nhiều tham số hơn LSI và LDA.",
                    "Vì ràng buộc không âm (W, H ≥ 0) dẫn đến cơ chế biểu diễn từng phần (parts-based) và độ thưa cao (54.7% bằng 0), triệt tiêu các từ nhiễu và gom các từ ngữ cảnh chặt chẽ.",
                    "Vì NMF tự động sửa lỗi chính tả trong tiếng Việt.",
                    "Vì NMF loại bỏ các văn bản ngắn trong quá trình huấn luyện."
                ],
                correct_index=1,
                explanation="Ràng buộc không âm buộc các đặc trưng chỉ được cộng thêm mà không được triệt tiêu bằng dấu âm, tạo ra ma trận thưa tự nhiên tập trung vào các từ ngữ cảnh mật thiết."
            ),
            QuizQuestion(
                id=6,
                question="Trọng số W trong NMF có phải là xác suất hay không?",
                options=[
                    "Có, vì các phần tử đều không âm.",
                    "Không, các phần tử không âm nhưng tổng hàng không mặc định bằng 1.0; chỉ khi chuẩn hóa L1 mới biểu diễn tỷ lệ đóng góp.",
                    "Có, scikit-learn tự động chuẩn hóa W thành phân phối xác suất.",
                    "Không, vì W chứa các số âm nhỏ."
                ],
                correct_index=1,
                explanation="W_ij ≥ 0 là điều kiện cần nhưng chưa đủ để là xác suất. Tổng hàng của W không bằng 1 mà phụ thuộc vào độ dài và độ lớn vector TF-IDF của tài liệu."
            )
        ]
    )

    return {
        "lsi": lsi_theory,
        "lda": lda_theory,
        "nmf": nmf_theory
    }
