import { NextResponse } from 'next/server'
import { withAuth, AuthenticatedRequest } from '@/lib/middleware/auth'
import { prisma } from '@/lib/prisma'
import { apiSuccess, apiError } from '@/lib/api'

interface RouteContext {
  params: {
    id: string
  }
}

// DELETE /api/expenses/:id - Deleta uma despesa
export const DELETE = withAuth(async (request: AuthenticatedRequest, context: RouteContext) => {
  const { id } = context.params

  try {
    // Primeiro, verifica se a despesa existe e pertence ao usuário
    const expense = await prisma.expense.findFirst({
      where: {
        id: id,
        userId: request.user!.id,
      },
    })

    if (!expense) {
      return apiError('Despesa não encontrada ou não pertence ao usuário.', 404)
    }

    // Se encontrou, deleta
    await prisma.expense.delete({
      where: { id: id },
    })

    return apiSuccess({ message: 'Despesa deletada com sucesso.' })
  } catch (error) {
    return apiError('Erro ao deletar despesa.', 500)
  }
}) 