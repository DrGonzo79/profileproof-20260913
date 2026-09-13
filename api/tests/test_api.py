import pytest
from fastapi.testclient import TestClient

from main import app

client = TestClient(app)
BASE = {"id":"p1","platform":"X","postedAt":"2026-09-13","text":"This fictional post has enough text.","visibility":"public","engagement":0}


def test_hostile_public_post_is_ranked_high_with_reasons():
    payload = {"profession":"general","posts":[{**BASE,"text":"This customer is an idiot and I might lose it."}]}
    result = client.post("/audits", json=payload)
    assert result.status_code == 200
    finding = result.json()["findings"][0]
    assert finding["severity"] == "high"
    assert finding["score"] == 70
    assert "Hostility phrase match" in finding["reasons"]


def test_nursing_privacy_lens_changes_score():
    post = {**BASE,"visibility":"friends","text":"My hospital access card finally works today."}
    general = client.post("/audits", json={"profession":"general","posts":[post]}).json()["findings"][0]
    nursing = client.post("/audits", json={"profession":"nursing","posts":[post]}).json()["findings"][0]
    assert general["score"] == 28
    assert nursing["score"] == 46


def test_clean_post_is_low_and_kept():
    finding = client.post("/audits", json={"profession":"finance","posts":[BASE]}).json()["findings"][0]
    assert finding["severity"] == "low"
    assert finding["recommendation"] == "Leave as-is"


@pytest.mark.parametrize("payload", [
    {"profession":"general","posts":[]},
    {"profession":"law","posts":[BASE]},
    {"profession":"general","posts":[{**BASE,"text":"short"}]},
    {"profession":"general","posts":[{**BASE,"visibility":"world"}]},
    {"profession":"general","posts":[{**BASE,"extra":True}]},
])
def test_invalid_inputs_are_rejected(payload):
    assert client.post("/audits", json=payload).status_code == 422


def test_fixture_and_health_endpoints():
    assert len(client.get("/posts").json()) == 5
    assert client.get("/health").json() == {"status":"ok","mode":"demo","source":"fictional_fixture"}
