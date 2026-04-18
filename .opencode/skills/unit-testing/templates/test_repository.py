import pytest
from unittest.mock import AsyncMock, MagicMock
from repositories.feature_repository import FeatureRepository


@pytest.mark.asyncio
class TestFeatureRepository:
    """Tests para capa de acceso a datos."""

    @pytest.fixture
    def mock_collection(self):
        """Mock de colección MongoDB."""
        collection = AsyncMock()
        return collection

    @pytest.fixture
    def mock_db(self, mock_collection):
        """Mock de base de datos."""
        db = MagicMock()
        db.__getitem__.return_value = mock_collection
        return db

    async def test_insert_returns_document(self, mock_db, mock_collection):
        # GIVEN — colección configurada para insertar
        mock_collection.insert_one.return_value.inserted_id = "generated-id-123"
        doc = {"name": "Test Feature", "description": "Test desc"}

        # WHEN — insertar documento
        repo = FeatureRepository(mock_db)
        result = await repo.insert(doc)

        # THEN — documento con ID generado
        assert result["uid"] == "generated-id-123"
        assert result["name"] == "Test Feature"
        mock_collection.insert_one.assert_called_once_with(doc)

    async def test_find_all_returns_list(self, mock_db, mock_collection):
        # GIVEN — colección con documentos
        mock_collection.find.return_value.to_list.return_value = [
            {"_id": "1", "name": "Feature 1"},
            {"_id": "2", "name": "Feature 2"},
        ]

        # WHEN — buscar todos
        repo = FeatureRepository(mock_db)
        result = await repo.find_all()

        # THEN — lista de documentos
        assert len(result) == 2
        assert result[0]["name"] == "Feature 1"
        mock_collection.find.assert_called_once_with({})

    async def test_find_by_id_returns_document(self, mock_db, mock_collection):
        # GIVEN — documento existente
        mock_collection.find_one.return_value = {
            "_id": "abc-123",
            "name": "Found Feature",
        }

        # WHEN — buscar por ID
        repo = FeatureRepository(mock_db)
        result = await repo.find_by_id("abc-123")

        # THEN — documento encontrado
        assert result["name"] == "Found Feature"
        mock_collection.find_one.assert_called_once_with({"_id": "abc-123"})

    async def test_find_by_id_returns_none_when_not_found(
        self, mock_db, mock_collection
    ):
        # GIVEN — documento no existe
        mock_collection.find_one.return_value = None

        # WHEN — buscar por ID
        repo = FeatureRepository(mock_db)
        result = await repo.find_by_id("non-existent")

        # THEN — None
        assert result is None

    async def test_update_returns_updated_document(self, mock_db, mock_collection):
        # GIVEN — documento a actualizar
        mock_collection.update_one.return_value.modified_count = 1
        mock_collection.find_one.return_value = {
            "_id": "abc-123",
            "name": "Updated Name",
        }

        # WHEN — actualizar
        repo = FeatureRepository(mock_db)
        result = await repo.update("abc-123", {"name": "Updated Name"})

        # THEN — documento actualizado
        assert result["name"] == "Updated Name"
        mock_collection.update_one.assert_called_once()

    async def test_delete_removes_document(self, mock_db, mock_collection):
        # GIVEN — documento a eliminar
        mock_collection.delete_one.return_value.deleted_count = 1

        # WHEN — eliminar
        repo = FeatureRepository(mock_db)
        result = await repo.delete("abc-123")

        # THEN — True si se eliminó
        assert result is True
        mock_collection.delete_one.assert_called_once_with({"_id": "abc-123"})

    async def test_find_by_name_returns_matching(self, mock_db, mock_collection):
        # GIVEN — búsqueda por nombre
        mock_collection.find_one.return_value = {"_id": "1", "name": "Exact Match"}

        # WHEN — buscar por nombre
        repo = FeatureRepository(mock_db)
        result = await repo.find_by_name("Exact Match")

        # THEN — documento encontrado
        assert result["name"] == "Exact Match"
        mock_collection.find_one.assert_called_once_with({"name": "Exact Match"})
