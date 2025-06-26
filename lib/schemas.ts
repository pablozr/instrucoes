import { z } from 'zod';

// Schema para registro de usuário
export const registerSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  confirmPassword: z.string(),
  acceptTerms: z.boolean().refine(val => val === true, 'Você deve aceitar os termos')
}).refine(data => data.password === data.confirmPassword, {
  message: 'Senhas não coincidem',
  path: ['confirmPassword']
});

// Schema para login
export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha é obrigatória')
});

// Enums
export const TipoUsuario = z.enum(['PESSOA_FISICA', 'PESSOA_JURIDICA']);
export const PerfilInvestidor = z.enum(['CONSERVADOR', 'MODERADO', 'AGRESSIVO']);
export const TipoInvestimento = z.enum(['TESOURO_DIRETO', 'CDB', 'LCI', 'LCA', 'DEBÊNTURES', 'AÇÕES', 'FIIS', 'FUNDOS']);
export const NaturezaGasto = z.enum(['NECESSARIO', 'SUPÉRFLUO', 'EMERGENCIAL']);

// Schema para usuário
export const userSchema = z.object({
  id: z.string(),
  nome: z.string(),
  email: z.string().email(),
  senha: z.string(),
  tipo: TipoUsuario.default('PESSOA_FISICA'),
  perfilInvestidor: PerfilInvestidor.nullable().optional(),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date())
});

export const publicUserSchema = userSchema.omit({ senha: true })

// Schema para investimento
export const investmentSchema = z.object({
  id: z.string(),
  userId: z.string(),
  tipo: TipoInvestimento,
  aporteMensal: z.number().positive('Aporte mensal deve ser positivo'),
  aporteInicial: z.number().positive('Aporte inicial deve ser positivo'),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date())
});

// Schema para relatório
export const reportSchema = z.object({
  id: z.string(),
  userId: z.string(),
  data: z.date(),
  tipo: z.string(),
  createdAt: z.date().default(() => new Date())
});

// Schema para gasto
export const expenseSchema = z.object({
  id: z.string(),
  userId: z.string(),
  valor: z.number().positive('Valor deve ser positivo'),
  data: z.date(),
  natureza: NaturezaGasto,
  categoryId: z.string(),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date())
});

// Schema para categoria de gasto
export const expenseCategorySchema = z.object({
  id: z.string(),
  userId: z.string(),
  nome: z.string().min(1, 'Nome da categoria é obrigatório'),
  descricao: z.string().optional(),
  createdAt: z.date().default(() => new Date())
});

// Schema para perfil
export const profileSchema = z.object({
  id: z.string(),
  userId: z.string(),
  cpf: z.string().optional(),
  cnpj: z.string().optional(),
  receitaAnual: z.number().positive().optional(),
  receitaMensal: z.number().positive().optional(),
  profissao: z.string().optional(),
  salario: z.number().positive().optional(),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date())
});

// Schema para alerta de gasto
export const expenseAlertSchema = z.object({
  id: z.string(),
  userId: z.string(),
  categoryId: z.string(),
  limiteGasto: z.number().positive('Limite deve ser positivo'),
  tipoTransacao: z.string(),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date())
});

// Tipos TypeScript derivados dos schemas
export type RegisterData = z.infer<typeof registerSchema>;
export type LoginData = z.infer<typeof loginSchema>;
export type User = z.infer<typeof userSchema>;
export type PublicUser = z.infer<typeof publicUserSchema>
export type Investment = z.infer<typeof investmentSchema>;
export type Report = z.infer<typeof reportSchema>;
export type Expense = z.infer<typeof expenseSchema>;
export type ExpenseCategory = z.infer<typeof expenseCategorySchema>;
export type Profile = z.infer<typeof profileSchema>;
export type ExpenseAlert = z.infer<typeof expenseAlertSchema>;

// Schema para criação de despesa (usado no formulário)
export const createExpenseSchema = z.object({
  valor: z.number().positive('Valor deve ser positivo'),
  data: z.coerce.date(),
  natureza: NaturezaGasto,
  categoryId: z.string().min(1, 'Categoria é obrigatória'),
});

// Schema para criação de categoria de despesa
export const createExpenseCategorySchema = expenseCategorySchema.pick({
  nome: true,
  descricao: true,
});

// Schema para resposta de API
export const apiResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.any().optional(),
  error: z.string().optional()
});

export type ApiResponse = z.infer<typeof apiResponseSchema>;
