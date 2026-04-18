import pytest
from unittest.mock import AsyncMock, MagicMock, patch
from fastapi.testclient import TestClient
from main import app


@pytest.fixture
def mock_service():
    """Mock del service para tests de router."""
    service = AsyncMock()
    return service


class TestFeatureRouter:
    """Tests de integración para endpoints HTTP."""

    def test_post_returns_201(self, client, mock_service, auth_headers):
        # GIVEN — servicio configurado para crear feature
        mock_service.create.return_value = {
            "uid": "new-uid",
            "name": "Test Feature",
            "created_at": "2026-01-15T10:00:00Z",
        }

        with patch("routes.feature_router.FeatureService", return_value=mock_service):
            # WHEN — POST request con datos válidos
            response = client.post(
                "/api/v1/features", json={"name": "Test Feature"}, headers=auth_headers
            )

            # THEN — 201 Created + datos correctos
            assert response.status_code == 201
            assert response.json()["uid"] == "new-uid"
            assert response.json()["name"] == "Test Feature"

    def test_post_returns_401_no_token(self, client):
        # GIVEN — request sin token

        # WHEN — POST sin auth
        response = client.post("/api/v1/features", json={"name": "Test Feature"})

        # THEN — 401 Unauthorized
        assert response.status_code == 401
        assert "detail" in response.json()

    def test_get_returns_200(self, client, mock_service, auth_headers):
        # GIVEN — lista de features
        mock_service.get_all.return_value = [
            {"uid": "1", "name": "Feature 1"},
            {"uid": "2", "name": "Feature 2"},
        ]

        with patch("routes.feature_router.FeatureService", return_value=mock_service):
            # WHEN — GET request
            response = client.get("/api/v1/features", headers=auth_headers)

            # THEN — 200 OK + lista
            assert response.status_code == 200
            assert len(response.json()) == 2

    def test_get_by_id_returns_404_not_found(self, client, mock_service, auth_headers):
        # GIVEN — feature no existe
        mock_service.get_by_id.side_effect = HTTPException(
            status_code=404, detail="Not found"
        )

        with patch("routes.feature_router.FeatureService", return_value=mock_service):
            # WHEN — GET con ID inexistente
            response = client.get("/api/v1/features/non-existent", headers=auth_headers)

            # THEN — 404 Not Found
            assert response.status_code == 404

    def test_post_returns_400_invalid_data(self, client, mock_service, auth_headers):
        # GIVEN — request con datos inválidos

        # WHEN — POST sin campo obligatorio
        response = client.post(
            "/api/v1/features",
            json={},  # Falta campo name
            headers=auth_headers,
        )

        # THEN — 422 Unprocessable Entity (validación FastAPI)
        assert response.status_code == 422
        assert "detail" in response.json()


@pytest.fixture
def client():
    """TestClient para FastAPI app."""
    return TestClient(app)


@pytest.fixture
def auth_headers():
    """Headers con token de autorización."""
    return {"Authorization": "Bearer mock-token-123"}
