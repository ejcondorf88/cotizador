import pytest
from unittest.mock import AsyncMock, MagicMock
from services.feature_service import FeatureService
from models.feature_model import FeatureCreate, FeatureUpdate


@pytest.mark.asyncio
class TestFeatureService:
    """Tests para FeatureService siguiendo patrón AAA."""

    async def test_create_success(self):
        # GIVEN — repositorio mock configurado
        repo = AsyncMock()
        repo.find_by_name.return_value = None  # No existe duplicado
        repo.insert.return_value = {
            "uid": "abc-123",
            "name": "Test Feature",
            "created_at": "2026-01-15T10:00:00Z",
        }

        # WHEN — ejecutar la acción
        service = FeatureService(repo)
        result = await service.create(FeatureCreate(name="Test Feature"))

        # THEN — verificar resultado y llamadas
        assert result["uid"] == "abc-123"
        assert result["name"] == "Test Feature"
        repo.insert.assert_called_once()
        repo.find_by_name.assert_called_once_with("Test Feature")

    async def test_create_duplicate_raises_conflict(self):
        # GIVEN — repositorio que encuentra duplicado
        repo = AsyncMock()
        repo.find_by_name.return_value = {"uid": "existing", "name": "Test Feature"}

        service = FeatureService(repo)

        # WHEN/THEN — debe lanzar excepción
        with pytest.raises(ValueError, match="Feature with this name already exists"):
            await service.create(FeatureCreate(name="Test Feature"))

        repo.insert.assert_not_called()

    async def test_get_not_found_raises_error(self):
        # GIVEN — repositorio que no encuentra el registro
        repo = AsyncMock()
        repo.find_by_id.return_value = None

        service = FeatureService(repo)

        # WHEN/THEN — debe lanzar NotFound
        with pytest.raises(NotFoundError, match="Feature not found"):
            await service.get_by_id("non-existent-id")

    async def test_update_success(self):
        # GIVEN — feature existente
        repo = AsyncMock()
        repo.find_by_id.return_value = {
            "uid": "abc-123",
            "name": "Old Name",
            "updated_at": "2026-01-10T10:00:00Z",
        }
        repo.update.return_value = {
            "uid": "abc-123",
            "name": "New Name",
            "updated_at": "2026-01-15T12:00:00Z",
        }

        # WHEN — actualizar
        service = FeatureService(repo)
        result = await service.update("abc-123", FeatureUpdate(name="New Name"))

        # THEN — actualizado correctamente
        assert result["name"] == "New Name"
        repo.update.assert_called_once()

    async def test_delete_success(self):
        # GIVEN — feature existente
        repo = AsyncMock()
        repo.find_by_id.return_value = {"uid": "abc-123", "name": "To Delete"}
        repo.delete.return_value = True

        # WHEN — eliminar
        service = FeatureService(repo)
        result = await service.delete("abc-123")

        # THEN — eliminado correctamente
        assert result is True
        repo.delete.assert_called_once_with("abc-123")


class NotFoundError(Exception):
    """Excepción personalizada para recursos no encontrados."""

    pass
