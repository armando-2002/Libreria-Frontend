import { useForm } from "react-hook-form";

export default function UsuarioForm({ initialData = {}, onSubmit }) {
  const { register, handleSubmit, setValue } = useForm({
    defaultValues: initialData,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <input {...register("nombre")} placeholder="Nombre completo" required />
      <input {...register("email")} type="email" placeholder="Correo" required />
      <select {...register("rol")} required>
        <option value="">Seleccionar Rol</option>
        <option value="profesor">Profesor</option>
        <option value="alumno">Alumno</option>
        <option value="admin">Admin</option>
      </select>
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Guardar
      </button>
    </form>
  );
}
