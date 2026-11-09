import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../hooks/useAuth";
import Spinner from "../../components/common/Spinner";
import Alert from "../../components/common/Alert";
import { getMe, updateMe } from "../../services/authService";
import { getErrorMessage } from "../../utils/format";

export default function Profile() {
  const { user: savedUser, updateUser } = useAuth();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ username: "", email: "", fullName: "", phone: "" });
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);

  // Lấy thông tin mới nhất từ backend (GET /users/me), rồi cập nhật lại user đang lưu trên giao diện
  const { data, isPending } = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const me = await getMe();
      updateUser(me);
      return me;
    },
  });

  const user = data ?? savedUser;

  // Lưu hồ sơ: PUT /users/me
  const mutation = useMutation({
    mutationFn: updateMe,
    onSuccess: (me) => {
      updateUser(me);
      // Cập nhật luôn cache của query ["me"], nếu không trang vẫn hiện dữ liệu cũ
      queryClient.setQueryData(["me"], me);
      setEditing(false);
      setSaved(true);
    },
  });

  const startEdit = () => {
    setForm({
      username: user.username ?? "",
      email: user.email ?? "",
      fullName: user.fullName ?? "",
      phone: user.phone ?? "",
    });
    setErrors({});
    setSaved(false);
    mutation.reset();
    setEditing(true);
  };

  const setField = (name) => (e) => setForm({ ...form, [name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!form.username.trim()) newErrors.username = "Vui lòng nhập tên đăng nhập.";
    if (!form.email.includes("@")) newErrors.email = "Email không hợp lệ.";
    if (form.phone.trim() && !/^[0-9+]{9,15}$/.test(form.phone.trim())) {
      newErrors.phone = "Số điện thoại không hợp lệ (9-15 chữ số).";
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    mutation.mutate({
      username: form.username.trim(),
      email: form.email.trim(),
      fullName: form.fullName.trim(),
      phone: form.phone.trim(),
    });
  };

  if (editing) {
    return (
      <div className="container">
        <form className="card narrow" onSubmit={handleSubmit} noValidate>
          <h1>Chỉnh sửa hồ sơ</h1>
          <Alert>{mutation.isError && getErrorMessage(mutation.error)}</Alert>

          <label>
            Tên đăng nhập
            <input value={form.username} onChange={setField("username")} />
            {errors.username && <small className="error">{errors.username}</small>}
          </label>

          <label>
            Email
            <input type="email" value={form.email} onChange={setField("email")} />
            {errors.email && <small className="error">{errors.email}</small>}
          </label>

          <label>
            Họ và tên
            <input value={form.fullName} onChange={setField("fullName")} />
          </label>

          <label>
            Số điện thoại
            <input value={form.phone} onChange={setField("phone")} />
            {errors.phone && <small className="error">{errors.phone}</small>}
          </label>

          <div className="row">
            <button type="submit" className="btn" disabled={mutation.isPending}>
              {mutation.isPending ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
            <button type="button" className="btn btn-outline" onClick={() => setEditing(false)}>
              Hủy
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card narrow">
        <h1>Hồ sơ của tôi</h1>
        {isPending && <Spinner />}
        {saved && <p className="muted">Đã cập nhật hồ sơ thành công.</p>}
        <p>
          <strong>Tên đăng nhập:</strong> {user.username}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Vai trò:</strong>{" "}
          <span className="badge">
            {user.role === "ADMIN" ? "Quản trị viên" : "Khách hàng"}
          </span>
        </p>
        <p>
          <strong>Họ và tên:</strong> {user.fullName || "Chưa cập nhật"}
        </p>
        <p>
          <strong>Số điện thoại:</strong> {user.phone || "Chưa cập nhật"}
        </p>
        <button type="button" className="btn" onClick={startEdit}>
          Chỉnh sửa hồ sơ
        </button>
      </div>
    </div>
  );
}
