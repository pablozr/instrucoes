import { NextResponse } from 'next/server'
import { withAuth, AuthenticatedRequest } from '@/lib/middleware/auth'
import { prisma } from '@/lib/prisma'
import { createExpenseCategorySchema } from '@/lib/schemas'
import { apiSuccess, apiError, validateRequestBody } from '@/lib/api'

// GET /api/expense-categories - Lista todas as categorias de despesa do usuário
export const GET = withAuth(async (request: AuthenticatedRequest) => {
  try {
    const categories = await prisma.expenseCategory.findMany({
      where: { userId: request.user!.id },
      orderBy: { nome: 'asc' },
    })
    return apiSuccess(categories)
  } catch (error) {
    return apiError('Erro ao buscar categorias.', 500)
  }
})

// POST /api/expense-categories - Cria uma nova categoria de despesa
export const POST = withAuth(async (request: AuthenticatedRequest) => {
  try {
    const { data, error } = await validateRequestBody(request, createExpenseCategorySchema)
    if (error) return error

    const { nome, descricao } = data!

    const newCategory = await prisma.expenseCategory.create({
      data: {
        nome,
        descricao: descricao || null, // Garante que seja null se vazio
        userId: request.user!.id,
      },
    })
    return apiSuccess(newCategory, 201)
  } catch (error) {
    // Adicionar verificação de erro para categoria duplicada (unique constraint)
    if (error instanceof Error && 'code' in error && (error as any).code === 'P2002') {
        return apiError('Já existe uma categoria com este nome.', 409)
    }
    return apiError('Erro ao criar categoria.', 500)
  }
}) 