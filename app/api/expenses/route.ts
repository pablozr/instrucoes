import { NextResponse } from 'next/server'
import { withAuth, AuthenticatedRequest } from '@/lib/middleware/auth'
import { prisma } from '@/lib/prisma'
import { createExpenseSchema } from '@/lib/schemas'
import { apiSuccess, apiError, validateRequestBody } from '@/lib/api'

// GET /api/expenses - Lista todas as despesas do usuário
export const GET = withAuth(async (request: AuthenticatedRequest) => {
  try {
    const expenses = await prisma.expense.findMany({
      where: { userId: request.user!.id },
      include: { category: true },
      orderBy: { data: 'desc' },
    })
    return apiSuccess(expenses)
  } catch (error) {
    return apiError('Erro ao buscar despesas.', 500)
  }
})

// POST /api/expenses - Cria uma nova despesa
export const POST = withAuth(async (request: AuthenticatedRequest) => {
  try {
    const { data, error } = await validateRequestBody(request, createExpenseSchema)
    if (error) return error

    const newExpense = await prisma.expense.create({
      data: {
        ...data!,
        userId: request.user!.id,
      },
      include: {
        category: true,
      },
    })
    return apiSuccess(newExpense, 201)
  } catch (error) {
    return apiError('Erro ao criar despesa.', 500)
  }
}) 