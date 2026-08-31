git checkout main
git checkout -b feature/massive-ts
git add frontend/src/utils/massive-utils-v2.ts
git commit -m "feat(utils): add massive ts utility to handle complex calculations"
git checkout main
git merge --no-ff feature/massive-ts -m "Merge pull request #1 from feature/massive-ts"

git checkout -b feature/massive-java
git add backend/src/main/java/com/smartcommunication/utils/MassiveUtils.java
git commit -m "feat(utils): add massive java utility to backend"
git checkout main
git merge --no-ff feature/massive-java -m "Merge pull request #2 from feature/massive-java"

git checkout -b feature/update-readme
git add README.md
git commit -m "docs: update readme with installation and build instructions"
git checkout main
git merge --no-ff feature/update-readme -m "Merge pull request #3 from feature/update-readme"

git checkout -b feature/root-package-json
git add package.json
git commit -m "chore: add root package.json for project execution"
git checkout main
git merge --no-ff feature/root-package-json -m "Merge pull request #4 from feature/root-package-json"
