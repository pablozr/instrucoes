import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, extractTokenFromHeader } from '../jwt';
import { UserService } from '../services/userService';

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    id: string;
    email: string;
    name: string;
  };
}

/**
 * Extrai e valida o token de autenticação da solicitação.
 */
async function validateToken(
  request: NextRequest
): Promise<{ user: { id: string; name: string; email: string } } | NextResponse> {
  const authHeader = request.headers.get('Authorization');
  const token =
    extractTokenFromHeader(authHeader) ||
    request.cookies.get('auth_token')?.value;

  if (!token) {
    return NextResponse.json(
      { success: false, message: 'Token de acesso não fornecido' },
      { status: 401 }
    );
  }

  try {
    const payload = verifyToken(token);
    const user = await UserService.findById(payload.userId);

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Usuário não encontrado' },
        { status: 401 }
      );
    }

    return { user: { id: user.id, name: user.nome, email: user.email } };
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Token inválido' },
      { status: 401 }
    );
  }
}

/**
 * HOC que protege um manipulador de rota com autenticação.
 */
export function withAuth<T>(
  handler: (request: AuthenticatedRequest, context: T) => Promise<NextResponse>
) {
  return async (request: NextRequest, context: T): Promise<NextResponse> => {
    const result = await validateToken(request);

    if (result instanceof NextResponse) {
      return result; // Retorna a resposta de erro
    }

    // Adiciona o usuário à requisição e chama o manipulador original
    const authenticatedRequest = request as AuthenticatedRequest;
    authenticatedRequest.user = result.user;
    return handler(authenticatedRequest, context);
  };
}
