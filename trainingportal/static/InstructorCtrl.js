app.controller("InstructorCtrl", function ($scope, $http,$location, $routeParams) {

    /**
     * fix bug one redirect the user if not admin to main menu in private
     */
    $http.get("/api/user", window.getAjaxOpts())
        .then(function (response) {
            if (response != null && response.data != null) {
                if (response.data.userRole === "user" ) {
                    $location.url("/");
                }

            }
        });

    $scope.percentDone = 0;
    $scope.completionLabel = "0/0";
    $scope.getDescriptionLink = (chId) => {
        if (chId) {
            return `/challenges/descriptions/${chId}`;
        }
    }

    $scope.isLoading = () => {
        return typeof $scope.challengesAvailable === 'undefined';
    }

    $scope.init = () => {
        $scope.moduleId = $routeParams.moduleId;
        $http.get(`/challenges/${$scope.moduleId}/level`)
            .then((response) => {
                if (response != null && response.data != null) {
                    $scope.userLevel = response.data.level;
                    $scope.loadChallenges();
                }
            });

    }



    $scope.loadChallenges = function () {
        $http.get(`/challenges/${$scope.moduleId}`)
            .then(function (response) {
                if (response != null && response.data != null && Array.isArray(response.data.challenges)) {
                    $scope.levelNames = {};
                    var challengeDefinitions = response.data.challenges;
                    var challengeCheck = response.data.check;
                    let totalChCount = 0;
                    let passedChCount = 0;
                    if (challengeDefinitions.length >= 1) {
                        //update the challenge definitions to include the current user's passed challenges
                        challengeDefinitionsModified = challengeDefinitions.map(levelId => {
                            var level = levelId.level;
                            $scope.levelNames[levelId] = levelId.name;

                            var challenges = levelId.challenges;
                            if (challenges.length > 0) {
                                $scope.challengesAvailable = true;
                            }
                            if (challenges != null) {
                                challenges = challenges.map(ch => {
                                    const id = ch.id;
                                    var passedChallenges = $scope.user.passedChallenges;
                                    totalChCount++;
                                    if (passedChallenges != null) {
                                        for (let passedCh of passedChallenges) {
                                            if (ch.id === passedCh.challengeId) {
                                                ch.passed = true;
                                                passedChCount++;
                                                break;
                                            }
                                        }
                                    }
                                    challengeCheck.forEach(check => {
                                        if (check.challenge_id === id) {
                                            ch = { ...check, ...ch };
                                        }
                                    });
                                    return ch;
                                })
                                levelId.challenges = challenges
                                return levelId;
                            }

                        })
                    }

                    $scope.targetUrl = response.data.targetUrl;
                    $scope.moduleChallengeDefinitions = challengeDefinitionsModified;
                    $scope.moduleChallengeChecks = challengeCheck;

                    $scope.percentDone = passedChCount / totalChCount * 100;
                    $scope.completionLabel = `${passedChCount}/${totalChCount}`;
                }
                else {
                    $scope.challengesAvailable = false;
                }
            });
    }

    /**
     * check box functions ... 
     * for challenge itself
     * for challenge solution
     */
    $scope.updateChallengeChange = function (challengeId, showChallengeValue) {
        $http.post("/updateShowChallenge", { "challengeId": challengeId, "showChallengeValue": showChallengeValue })
            .then(function (response) {
                console.log(response);
            });
    }

    $scope.updateChallengeSolutionChange = function (challengeId, showChallengeSolutionValue) {
        $http.post("/updateShowChallengeSolution", { "challengeId": challengeId, "showChallengeSolutionValue": showChallengeSolutionValue })
            .then(function (response) {
                console.log(response);
            });
    }
});