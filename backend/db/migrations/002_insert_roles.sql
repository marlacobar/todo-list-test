-- Insertar rol_names por defecto
-- NOTA: Esto solo inserta si no existen ya

INSERT INTO rol (rol_name)
SELECT 'VIEWER_ALL'
WHERE NOT EXISTS (
  SELECT 1 FROM rol WHERE rol_name = 'VIEWER_ALL'
);

INSERT INTO rol (rol_name)
SELECT 'VIEWER_OWN'
WHERE NOT EXISTS (
  SELECT 1 FROM rol WHERE rol_name = 'VIEWER_OWN'
);
