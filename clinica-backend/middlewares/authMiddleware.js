const jwt = require('jsonwebtoken');

// ✅ CORREÇÃO: Agora aceita parâmetros de roles
const authMiddleware = (allowedRoles = []) => {
  return async (req, res, next) => {
    try {
      const token = req.header('Authorization')?.replace('Bearer ', '');
      
      if (!token) {
        return res.status(401).json({ message: 'Token não fornecido' });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // ✅ Verifica se o usuário tem a role permitida
      if (allowedRoles.length > 0 && !allowedRoles.includes(decoded.role)) {
        return res.status(403).json({ message: 'Acesso negado para sua role' });
      }

      req.user = decoded; // ✅ Agora salva o usuário completo
      next();
    } catch (error) {
      res.status(401).json({ message: 'Token inválido' });
    }
  };
};

module.exports = authMiddleware;