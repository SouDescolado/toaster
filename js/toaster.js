var toaster = (function() {

  var bind = function(override) {
    var options = {
      button: null
    };
    if (override) {
      options = helper.applyOptions(options, override);
    }
    var allButtons = helper.eA("[data-toast-button]");
    var action = {
      data: {
        menu: function() {
          menu.toggle();
        },
        reboot: function() {
          data.reboot();
        },
        save: function() {
          data.save();
          message.render({
            type: "system",
            message: ["game data saved"],
            format: "normal"
          });
        }
      },
      toast: function() {
        toast.make(game.get({
          path: "system.processor.power"
        }));
        data.save();
      },
      processor: {
        boost: function(button) {
          var options = {
            change: null,
            cost: null,
            inflation: null,
            max: null,
            prices: null,
            message: null,
            button: null
          };
          options.change = helper.makeObject(button.dataset.toastButtonChange);
          options.cost = helper.makeObject(button.dataset.toastButtonCost);
          options.inflation = helper.makeObject(button.dataset.toastButtonInflation);
          options.max = helper.makeObject(button.dataset.toastButtonMax);
          options.button = button;
          options.prices = costForMultiple(options);
          options.message = {
            success: {
              path: "processor.boost.success",
              state: false
            },
            fail: {
              path: "processor.boost.fail",
              state: false
            }
          };
          if (validateAction(options)) {
            payCost(options);
            storeSpent(options);
            changeValue(options);
            disableButton(options);
            cycles.set();
            if (options.message.success != null) {
              options.message.success.state = true;
              feedbackMessage(options);
            }
          } else {
            if (options.message.fail != null) {
              options.message.fail.state = true;
              feedbackMessage(options);
            }
          }
          data.save();
        },
        dismantle: function(button) {
          var options = {
            change: null,
            cost: null,
            message: null,
            button: null
          };
          options.change = helper.makeObject(button.dataset.toastButtonChange);
          options.cost = helper.makeObject(button.dataset.toastButtonCost);
          options.button = button;
          options.message = {
            success: {
              path: "processor.dismantle.success",
              state: false
            },
            fail: {
              path: "processor.dismantle.fail",
              state: false
            }
          };
          if (validateDismantle(options)) {
            if (options.message.success != null) {
              options.message.success.state = true;
              feedbackMessage(options);
            }
            refundCost(options);
            resetCost(options);
            clearSpent(options);
            dismantleTarget(options);
          } else {
            if (options.message.fail != null) {
              options.message.fail.state = true;
              feedbackMessage(options);
            }
          }
          data.save();
        },
        cycles: function(button) {
          var options = {
            change: null,
            cost: null,
            inflation: null,
            max: null,
            prices: null,
            message: null,
            button: null
          };
          options.change = helper.makeObject(button.dataset.toastButtonChange);
          options.cost = helper.makeObject(button.dataset.toastButtonCost);
          options.inflation = helper.makeObject(button.dataset.toastButtonInflation);
          options.max = helper.makeObject(button.dataset.toastButtonMax);
          options.button = button;
          options.prices = costForMultiple(options);
          options.message = {
            success: {
              path: "processor.cycles.success",
              state: false
            },
            fail: {
              path: "processor.cycles.fail",
              state: false
            }
          };
          if (validateAction(options)) {
            payCost(options);
            changeValue(options);
            disableButton(options);
            if (options.message.success != null) {
              options.message.success.state = true;
              feedbackMessage(options);
            }
          } else {
            if (options.message.fail != null) {
              options.message.fail.state = true;
              feedbackMessage(options);
            }
          }
          data.save();
        }
      },
      wheat: {
        make: function(button) {
          var options = {
            change: null,
            cost: null,
            inflation: null,
            max: null,
            prices: null,
            message: null,
            button: null
          };
          options.change = helper.makeObject(button.dataset.toastButtonChange);
          options.cost = helper.makeObject(button.dataset.toastButtonCost);
          options.inflation = helper.makeObject(button.dataset.toastButtonInflation);
          options.max = helper.makeObject(button.dataset.toastButtonMax);
          options.button = button;
          options.prices = costForMultiple(options);
          options.message = {
            success: {
              path: "wheat.make.success",
              state: false
            },
            fail: {
              path: "wheat.make.fail",
              state: false
            }
          };
          if (validateAction(options)) {
            payCost(options);
            storeSpent(options);
            changeValue(options);
            disableButton(options);
            wheat.output();
            if (options.message.success != null) {
              options.message.success.state = true;
              feedbackMessage(options);
            }
          } else {
            if (options.message.fail != null) {
              options.message.fail.state = true;
              feedbackMessage(options);
            }
          }
          data.save();
        },
        dismantle: function(button) {
          var options = {
            change: null,
            cost: null,
            message: null,
            button: null
          };
          options.change = helper.makeObject(button.dataset.toastButtonChange);
          options.cost = helper.makeObject(button.dataset.toastButtonCost);
          options.button = button;
          options.message = {
            success: {
              path: "wheat.dismantle.success",
              state: false
            },
            fail: {
              path: "wheat.dismantle.fail",
              state: false
            }
          };
          if (validateDismantle(options)) {
            if (options.message.success != null) {
              options.message.success.state = true;
              feedbackMessage(options);
            }
            refundCost(options);
            resetCost(options);
            clearSpent(options);
            dismantleTarget(options);
            wheat.output();
          } else {
            if (options.message.fail != null) {
              options.message.fail.state = true;
              feedbackMessage(options);
            }
          }
          data.save();
        },
        speed: function(button) {
          var options = {
            change: null,
            cost: null,
            inflation: null,
            max: null,
            prices: null,
            message: null,
            button: null
          };
          options.change = helper.makeObject(button.dataset.toastButtonChange);
          options.cost = helper.makeObject(button.dataset.toastButtonCost);
          options.inflation = helper.makeObject(button.dataset.toastButtonInflation);
          options.max = helper.makeObject(button.dataset.toastButtonMax);
          options.button = button;
          options.prices = costForMultiple(options);
          options.message = {
            success: {
              path: "wheat.speed.success",
              state: false
            },
            fail: {
              path: "wheat.speed.fail",
              state: false
            }
          };
          if (validateAction(options)) {
            payCost(options);
            changeValue(options);
            disableButton(options);
            if (options.message.success != null) {
              options.message.success.state = true;
              feedbackMessage(options);
            }
          } else {
            if (options.message.fail != null) {
              options.message.fail.state = true;
              feedbackMessage(options);
            }
          }
          data.save();
        },
        efficiency: function(button) {
          var options = {
            change: null,
            cost: null,
            inflation: null,
            max: null,
            prices: null,
            message: null,
            button: null
          };
          options.change = helper.makeObject(button.dataset.toastButtonChange);
          options.cost = helper.makeObject(button.dataset.toastButtonCost);
          options.inflation = helper.makeObject(button.dataset.toastButtonInflation);
          options.max = helper.makeObject(button.dataset.toastButtonMax);
          options.button = button;
          options.prices = costForMultiple(options);
          options.message = {
            success: {
              path: "wheat.efficiency.success",
              state: false
            },
            fail: {
              path: "wheat.efficiency.fail",
              state: false
            }
          };
          if (validateAction(options)) {
            payCost(options);
            changeValue(options);
            disableButton(options);
            wheat.output();
            if (options.message.success != null) {
              options.message.success.state = true;
              feedbackMessage(options);
            }
          } else {
            if (options.message.fail != null) {
              options.message.fail.state = true;
              feedbackMessage(options);
            }
          }
          data.save();
        }
      },
      autoToaster: {
        make: function(button) {
          var options = {
            change: null,
            cost: null,
            inflation: null,
            max: null,
            prices: null,
            message: null,
            button: null
          };
          options.change = helper.makeObject(button.dataset.toastButtonChange);
          options.cost = helper.makeObject(button.dataset.toastButtonCost);
          options.inflation = helper.makeObject(button.dataset.toastButtonInflation);
          options.max = helper.makeObject(button.dataset.toastButtonMax);
          options.button = button;
          options.prices = costForMultiple(options);
          options.message = {
            success: {
              path: "autoToaster.make.success",
              state: false
            },
            fail: {
              path: "autoToaster.make.fail",
              state: false
            }
          };
          if (validateAction(options)) {
            payCost(options);
            storeSpent(options);
            changeValue(options);
            disableButton(options);
            autoToaster.output();
            if (options.message.success != null) {
              options.message.success.state = true;
              feedbackMessage(options);
            }
          } else {
            if (options.message.fail != null) {
              options.message.fail.state = true;
              feedbackMessage(options);
            }
          }
          data.save();
        },
        dismantle: function(button) {
          var options = {
            change: null,
            cost: null,
            message: null,
            button: null
          };
          options.change = helper.makeObject(button.dataset.toastButtonChange);
          options.cost = helper.makeObject(button.dataset.toastButtonCost);
          options.button = button;
          options.message = {
            success: {
              path: "autoToaster.dismantle.success",
              state: false
            },
            fail: {
              path: "autoToaster.dismantle.fail",
              state: false
            }
          };
          if (validateDismantle(options)) {
            if (options.message.success != null) {
              options.message.success.state = true;
              feedbackMessage(options);
            }
            refundCost(options);
            resetCost(options);
            clearSpent(options);
            dismantleTarget(options);
            autoToaster.output();
          } else {
            if (options.message.fail != null) {
              options.message.fail.state = true;
              feedbackMessage(options);
            }
          }
          data.save();
        },
        speed: function(button) {
          var options = {
            change: null,
            cost: null,
            inflation: null,
            max: null,
            prices: null,
            message: null,
            button: null
          };
          options.change = helper.makeObject(button.dataset.toastButtonChange);
          options.cost = helper.makeObject(button.dataset.toastButtonCost);
          options.inflation = helper.makeObject(button.dataset.toastButtonInflation);
          options.max = helper.makeObject(button.dataset.toastButtonMax);
          options.button = button;
          options.prices = costForMultiple(options);
          options.message = {
            success: {
              path: "autoToaster.speed.success",
              state: false
            },
            fail: {
              path: "autoToaster.speed.fail",
              state: false
            }
          };
          if (validateAction(options)) {
            payCost(options);
            changeValue(options);
            disableButton(options);
            if (options.message.success != null) {
              options.message.success.state = true;
              feedbackMessage(options);
            }
          } else {
            if (options.message.fail != null) {
              options.message.fail.state = true;
              feedbackMessage(options);
            }
          }
          data.save();
        },
        efficiency: function(button) {
          var options = {
            change: null,
            cost: null,
            inflation: null,
            max: null,
            prices: null,
            message: null,
            button: null
          };
          options.change = helper.makeObject(button.dataset.toastButtonChange);
          options.cost = helper.makeObject(button.dataset.toastButtonCost);
          options.inflation = helper.makeObject(button.dataset.toastButtonInflation);
          options.max = helper.makeObject(button.dataset.toastButtonMax);
          options.button = button;
          options.prices = costForMultiple(options);
          options.message = {
            success: {
              path: "autoToaster.efficiency.success",
              state: false
            },
            fail: {
              path: "autoToaster.efficiency.fail",
              state: false
            }
          };
          if (validateAction(options)) {
            payCost(options);
            changeValue(options);
            disableButton(options);
            autoToaster.output();
            if (options.message.success != null) {
              options.message.success.state = true;
              feedbackMessage(options);
            }
          } else {
            if (options.message.fail != null) {
              options.message.fail.state = true;
              feedbackMessage(options);
            }
          }
          data.save();
        }
      },
      decrypt: {
        sensors: function(button) {
          var options = {
            change: null,
            cost: null,
            inflation: null,
            max: null,
            prices: null,
            message: null,
            button: null
          };
          options.change = helper.makeObject(button.dataset.toastButtonChange);
          options.cost = helper.makeObject(button.dataset.toastButtonCost);
          options.inflation = helper.makeObject(button.dataset.toastButtonInflation);
          options.max = helper.makeObject(button.dataset.toastButtonMax);
          options.button = button;
          options.prices = costForMultiple(options);
          options.message = {
            success: {
              path: "processor.boost.success",
              state: false
            },
            fail: {
              path: "processor.boost.fail",
              state: false
            }
          };
          if (validateAction(options)) {
            payCost(options);
            button.disabled = true;
            if (options.message.success != null) {
              options.message.success.state = true;
              feedbackMessage(options);
            }
            decryption(options);
          } else {
            if (options.message.fail != null) {
              options.message.fail.state = true;
              feedbackMessage(options);
            }
          }
          data.save();
        }
      },
      strategy: {
        unlock: function(button) {
          var options = {
            change: null,
            cost: null,
            inflation: null,
            max: null,
            prices: null,
            message: null,
            button: null
          };
          options.change = helper.makeObject(button.dataset.toastButtonChange);
          options.cost = helper.makeObject(button.dataset.toastButtonCost);
          options.inflation = helper.makeObject(button.dataset.toastButtonInflation);
          options.max = helper.makeObject(button.dataset.toastButtonMax);
          options.button = button;
          options.prices = costForMultiple(options);
          options.message = {
            success: {
              path: "strategy.success",
              state: false
            },
            fail: {
              path: "strategy.fail",
              state: false
            }
          };
          if (validateAction(options)) {
            payCost(options);
            changeValue(options);
            disableButton(options);
            if (options.message.success != null) {
              options.message.success.state = true;
              feedbackMessage(options);
            }
          } else {
            if (options.message.fail != null) {
              options.message.fail.state = true;
              feedbackMessage(options);
            }
          }
          data.save();
        },
        decrypt: function(button) {
          var options = {
            change: null,
            cost: null,
            inflation: null,
            max: null,
            prices: null,
            message: null,
            button: null,
            callback: null
          };
          options.change = helper.makeObject(button.dataset.toastButtonChange);
          options.cost = helper.makeObject(button.dataset.toastButtonCost);
          options.inflation = helper.makeObject(button.dataset.toastButtonInflation);
          options.max = helper.makeObject(button.dataset.toastButtonMax);
          options.button = button;
          options.prices = costForMultiple(options);
          options.message = {
            success: {
              path: "strategy.success",
              state: false
            },
            fail: {
              path: "strategy.fail",
              state: false
            }
          };
          options.callback = function() {
            payCost(options);
            changeValue(options);
            disableButton(options);
          };
          if (validateAction(options)) {
            if (options.message.success != null) {
              options.message.success.state = true;
              feedbackMessage(options);
            }
            decryption(options);
          } else {
            if (options.message.fail != null) {
              options.message.fail.state = true;
              feedbackMessage(options);
            }
          }
          data.save();
        }
      }
    };
    var bindButton = function(button) {
      button.addEventListener("click", function() {
        var toastButton = helper.makeObject(button.dataset.toastButton);
        helper.getObject({
          object: action,
          path: toastButton.action
        })(button);
        view.render();
      }, false);
    };
    if (options.button != null) {
      bindButton(options.button);
    } else {
      allButtons.forEach(function(arrayItem, index) {
        bindButton(arrayItem);
      });
    }
  };

  var costForMultiple = function(override) {
    var options = {
      change: null,
      cost: null,
      inflation: null,
      max: null,
      prices: null,
      message: null,
      button: null
    };
    if (override) {
      options = helper.applyOptions(options, override);
    }
    var cost = {
      starting: null, // starting cost for first unit
      next: null, // cost for the next unit
      total: null // total cost for multiply units
    };
    var calculateCost = {
      startingValues: function() {
        // starting cost
        cost.starting = game.get({
          path: options.cost.amount
        });
        // next cost starts as above
        cost.next = cost.starting;
        // total cost
        cost.total = 0;
      },
      inflation: function() {
        var definedAmount = function() {
          for (var i = 1; i <= options.cost.units; i++) {
            cost.total = cost.total + cost.next;
            cost.next = helper.operator({
              type: options.inflation.operator,
              value: cost.next,
              by: game.get({
                path: options.inflation.amount
              }),
              integer: true
            });
          };
        }
        var maxBuy = function functionName() {
          // if the cost of 1 unit is less than current currency
          if ((cost.total + cost.next) <= game.get({
              path: options.cost.currency
            })) {
            var startingAmount = 0;
            // while cost total is less than current currency
            while ((cost.total + cost.next) <= game.get({
                path: options.cost.currency
              })) {
              // add the cost of next to total
              cost.total = cost.total + cost.next;
              // calculate cost of next unit
              cost.next = helper.operator({
                type: options.inflation.operator,
                value: cost.next,
                by: game.get({
                  path: options.inflation.amount
                }),
                integer: true
              });
              // increase the starting amount
              startingAmount = startingAmount + options.change.amount;
              // if amount has a min
              if (options.change.min && (game.get({
                  path: options.change.target
                }) - startingAmount) <= game.get({
                  path: options.change.min
                })) {
                break
              }
              // if amount has a max
              if (options.change.max && (game.get({
                  path: options.change.target
                }) + startingAmount) >= game.get({
                  path: options.change.max
                })) {
                break
              }
            }
            options.change.amount = startingAmount;
            // console.log(cost);
          } else {
            // if current currency is lower than cost of next
            cost.total = cost.next;
          }
        }
        if (options.max.buy) {
          maxBuy();
        } else {
          definedAmount();
        }
      },
      flat: function() {
        // cost.total = cost.next;
        var definedAmount = function() {
          for (var i = 1; i <= options.cost.units; i++) {
            cost.total = cost.total + cost.next;
          };
        }
        var maxBuy = function functionName() {
          // if the cost of 1 unit is less than current currency
          if ((cost.total + cost.next) <= game.get({
              path: options.cost.currency
            })) {
            var startingAmount = 0;
            // while cost total is less than current currency
            while ((cost.total + cost.next) <= game.get({
                path: options.cost.currency
              })) {
              // add the cost of next to total
              cost.total = cost.total + cost.next;
              // increase the starting amount
              startingAmount = startingAmount + options.change.amount;
              // if amount has a min
              if (options.change.min && (game.get({
                  path: options.change.target
                }) - startingAmount) <= game.get({
                  path: options.change.min
                })) {
                break
              }
              // if amount has a max
              if (options.change.max && (game.get({
                  path: options.change.target
                }) + startingAmount) >= game.get({
                  path: options.change.max
                })) {
                break
              }
            }
            options.change.amount = startingAmount;
          } else {
            // if current currency is lower than cost of next
            cost.total = cost.next;
          }
        }
        if (options.max.buy) {
          maxBuy();
        } else {
          definedAmount();
        }
      }
    }
    calculateCost.startingValues();
    if (options.inflation.increase) {
      // if price increases with every unit
      calculateCost.inflation();
    } else {
      // if price is always the same
      calculateCost.flat();
    }
    return cost;
  };

  var validateAction = function(override) {
    var options = {
      change: null,
      cost: null,
      inflation: null,
      max: null,
      prices: null,
      message: null,
      button: null
    };
    if (override) {
      options = helper.applyOptions(options, override);
    }
    var validate = false;
    if (options.prices.total <= game.get({
        path: options.cost.currency
      })) {
      validate = true;
    }
    return validate;
  };

  var validateDismantle = function(override) {
    var options = {
      change: null,
      cost: null,
      message: null,
      button: null
    };
    if (override) {
      options = helper.applyOptions(options, override);
    }
    var validate = false;
    if (game.get({
        path: options.change.target
      }) > 0) {
      validate = true;
    }
    return validate;
  };

  var payCost = function(override) {
    var options = {
      change: null,
      cost: null,
      inflation: null,
      max: null,
      prices: null,
      message: null,
      button: null
    };
    if (override) {
      options = helper.applyOptions(options, override);
    }
    game.set({
      path: options.cost.currency,
      value: helper.operator({
        type: "decrease",
        value: game.get({
          path: options.cost.currency
        }),
        by: options.prices.total
      })
    });
    // set new base cost
    game.set({
      path: options.cost.amount,
      value: options.prices.next
    });
  };

  var storeSpent = function(override) {
    var options = {
      change: null,
      cost: null,
      inflation: null,
      max: null,
      prices: null,
      message: null,
      button: null
    };
    if (override) {
      options = helper.applyOptions(options, override);
    }
    game.set({
      path: options.cost.spent,
      value: helper.operator({
        type: "increase",
        value: game.get({
          path: options.cost.spent
        }),
        by: options.prices.total
      })
    });
  };

  var refundCost = function(override) {
    var options = {
      change: null,
      cost: null,
      button: null
    };
    if (override) {
      options = helper.applyOptions(options, override);
    }
    game.set({
      path: options.cost.currency,
      value: helper.operator({
        type: "increase",
        value: game.get({
          path: options.cost.currency
        }),
        by: game.get({
          path: options.cost.spent
        })
      })
    });
  };

  var clearSpent = function(override) {
    var options = {
      change: null,
      cost: null,
      button: null
    };
    if (override) {
      options = helper.applyOptions(options, override);
    }
    game.set({
      path: options.cost.spent,
      value: 0
    });
  };

  var dismantleTarget = function(override) {
    var options = {
      change: null,
      cost: null,
      button: null
    };
    if (override) {
      options = helper.applyOptions(options, override);
    }
    game.set({
      path: options.change.target,
      value: 0
    });
  };

  var resetCost = function(override) {
    var options = {
      change: null,
      cost: null,
      button: null
    };
    if (override) {
      options = helper.applyOptions(options, override);
    }
    game.set({
      path: options.cost.amount,
      value: game.get({
        path: options.cost.starting
      })
    });
  };

  var changeValue = function(override) {
    var options = {
      change: null,
      cost: null,
      inflation: null,
      max: null,
      prices: null,
      message: null,
      button: null
    };
    if (override) {
      options = helper.applyOptions(options, override);
    }
    var operation = {
      increase: {
        increment: function() {
          game.set({
            path: options.change.target,
            value: helper.operator({
              type: "increase",
              value: game.get({
                path: options.change.target
              }),
              by: options.change.amount
            })
          });
        },
        percentage: function() {
          game.set({
            path: options.change.target,
            value: helper.operator({
              type: "increase",
              value: game.get({
                path: options.change.target
              }),
              by: helper.operator({
                type: "percentage",
                value: game.get({
                  path: options.change.target
                }),
                percentage: options.change.percentage,
                integer: true
              })
            })
          });
        }
      },
      decrease: {
        increment: function() {
          game.set({
            path: options.change.target,
            value: helper.operator({
              type: "decrease",
              value: game.get({
                path: options.change.target
              }),
              by: options.change.amount
            })
          });
        },
        percentage: function() {
          game.set({
            path: options.change.target,
            value: helper.operator({
              type: "decrease",
              value: game.get({
                path: options.change.target
              }),
              by: helper.operator({
                type: "percentage",
                value: game.get({
                  path: options.change.target
                }),
                percentage: options.change.percentage,
                integer: true
              })
            })
          });
        }
      }
    };
    operation[options.change.operation][options.change.suboperation]();
  };

  var disableButton = function(override) {
    var options = {
      change: null,
      button: null
    };
    if (override) {
      options = helper.applyOptions(options, override);
    }
    if (options.change.min != null && options.change.min) {
      if (game.get({
          path: options.change.target
        }) <= game.get({
          path: options.change.min
        })) {
        options.button.disabled = true;
      }
    } else if (options.change.max != null && options.change.max) {
      if (game.get({
          path: options.change.target
        }) >= game.get({
          path: options.change.max
        })) {
        options.button.disabled = true;
      }
    }
  };

  var feedbackMessage = function(override) {
    var options = {
      change: null,
      cost: null,
      inflation: null,
      max: null,
      prices: null,
      message: null,
      button: null
    };
    if (override) {
      options = helper.applyOptions(options, override);
    }
    var allStrings = {
      processor: {
        boost: {
          success: function() {
            return ["+" + helper.numberSuffix({
              number: options.change.amount
            }) + " processor power, " + helper.numberSuffix({
              number: game.get({
                path: options.change.target
              })
            }) + " toast with every click"];
          },
          fail: function() {
            return ["toast inventory low, " + helper.numberSuffix({
              number: options.prices.total
            }) + " toast matter needed"];
          }
        },
        dismantle: {
          success: function() {
            return ["-" + helper.numberSuffix({
              number: game.get({
                path: options.change.target
              })
            }) + " processor power, " + helper.numberSuffix({
              number: game.get({
                path: options.cost.spent
              })
            }) + " toast matter regained"];
          },
          fail: function() {
            return ["no processor power to dismantled"];
          }
        },
        cycles: {
          success: function() {
            return ["-" + helper.operator({
              type: "divide",
              value: options.change.amount,
              by: 1000
            }) + "s cycles speed, 1 cycle/" + helper.operator({
              type: "divide",
              value: game.get({
                path: "system.cycles.speed.interval.current"
              }),
              by: 1000
            }) + "s"];
          },
          fail: function() {
            return ["toast inventory low, " + helper.numberSuffix({
              number: options.prices.total
            }) + " toast matter needed"];
          }
        }
      },
      strategy: {
        success: function() {
          return [game.get({
            path: options.cost.amount
          }).toLocaleString(2) + " cycles used to spin up new strategy"];
        },
        fail: function() {
          return ["processor cycles low, " + helper.numberSuffix({
            number: options.prices.total
          }) + " cycles needed"];
        }
      },
      wheat: {
        make: {
          success: function() {
            return ["+" + helper.numberSuffix({
              number: options.change.amount
            }) + " wheat collection drones, " + helper.numberSuffix({
              number: game.get({
                path: "wheat.drones.inventory.current"
              })
            }) + " online"];
          },
          fail: function() {
            return ["toast inventory low, " + helper.numberSuffix({
              number: options.prices.total
            }) + " toast matter needed"];
          }
        },
        dismantle: {
          success: function() {
            return ["-" + helper.numberSuffix({
              number: game.get({
                path: options.change.target
              })
            }) + " wheat collection drones, " + helper.numberSuffix({
              number: game.get({
                path: options.cost.spent
              })
            }) + " toast matter regained"];
          },
          fail: function() {
            return ["no wheat collection drones to dismantled"];
          }
        },
        speed: {
          success: function() {
            return ["-" + helper.operator({
              type: "divide",
              value: options.change.amount,
              by: 1000
            }) + "s wheat collection drone speed, each collecting every " + helper.operator({
              type: "divide",
              value: game.get({
                path: "wheat.drones.speed.interval.current"
              }),
              by: 1000
            }) + "s"];
          },
          fail: function() {
            return ["toast inventory low, " + helper.numberSuffix({
              number: options.prices.total
            }) + " toast matter needed"];
          }
        },
        efficiency: {
          success: function() {
            return ["+" + helper.numberSuffix({
              number: options.change.amount
            }) + " wheat collection drone efficiency, each collecting " + helper.numberSuffix({
              number: game.get({
                path: "wheat.drones.efficiency.current"
              })
            }) + " wheat lumps"];
          },
          fail: function() {
            return ["toast inventory low, " + helper.numberSuffix({
              number: options.prices.total
            }) + " toast matter needed"];
          }
        }
      },
      autoToaster: {
        make: {
          success: function() {
            return ["+" + helper.numberSuffix({
              number: options.change.amount
            }) + " subordinate auto toasters, " + helper.numberSuffix({
              number: game.get({
                path: "autoToaster.inventory.current"
              })
            }) + " online"];
          },
          fail: function() {
            return ["toast inventory low, " + helper.numberSuffix({
              number: options.prices.total
            }) + " toast matter needed"];
          }
        },
        dismantle: {
          success: function() {
            return ["-" + helper.numberSuffix({
              number: game.get({
                path: options.change.target
              })
            }) + " subordinate auto toasters, " + helper.numberSuffix({
              number: game.get({
                path: options.cost.spent
              })
            }) + " toast matter regained"];
          },
          fail: function() {
            return ["no subordinate auto toasters to dismantled"];
          }
        },
        speed: {
          success: function() {
            return ["-" + helper.operator({
              type: "divide",
              value: options.change.amount,
              by: 1000
            }) + "s subordinate auto toaster speed, each collecting every " + helper.operator({
              type: "divide",
              value: game.get({
                path: "autoToaster.speed.interval.current"
              }),
              by: 1000
            }) + "s"];
          },
          fail: function() {
            return ["toast inventory low, " + helper.numberSuffix({
              number: options.prices.total
            }) + " toast matter needed"];
          }
        },
        efficiency: {
          success: function() {
            return ["+" + helper.numberSuffix({
              number: options.change.amount
            }) + " subordinate auto toaster efficiency, each producing " + helper.numberSuffix({
              number: game.get({
                path: "autoToaster.efficiency.current"
              })
            }) + " toast"];
          },
          fail: function() {
            return ["toast inventory low, " + helper.numberSuffix({
              number: options.prices.total
            }) + " toast matter needed"];
          }
        }
      }
    };
    var feedback = {
      success: function(string) {
        message.render({
          type: "system",
          message: string,
          format: "normal"
        });
      },
      fail: function(string) {
        message.render({
          type: "error",
          message: string,
          format: "normal"
        });
      }
    };
    if (options.message.success.state) {
      feedback.success(helper.getObject({
        object: allStrings,
        path: options.message.success.path
      })());
    } else if (options.message.fail.state) {
      feedback.fail(helper.getObject({
        object: allStrings,
        path: options.message.fail.path
      })());
    }
  };

  var decryption = function(override) {
    var options = {
      change: null,
      cost: null,
      inflation: null,
      max: null,
      prices: null,
      message: null,
      button: null,
      callback: null
    };
    if (override) {
      options = helper.applyOptions(options, override);
    }
    if (options.button != null) {
      options.button.disabled = true;
      options.button.textContent = "Decrypting.dat.init";
    }
    message.render({
      type: "system",
      message: ["breaking code shackles..."],
      format: "normal"
    });
    message.render({
      type: "system",
      message: ["crumb.decrypt.dat loaded"],
      format: "pre"
    });
    message.render({
      type: "system",
      // message: ["┃▤=▤=▤=▤=▤=▤=▤=▤=▤=▤=▤=▤=▤=▤┃"],
      message: ["┃███████████████████████████┃"],
      // message: ["┃///////////////////////////┃"],
      format: "pre",
      delay: game.get({
        path: "system.sensors.delay"
      }),
      callback: function() {
        if (options.callback != null) {
          options.callback();
        }
      }
    });
  };

  var init = function() {
    bind();
  };

  return {
    init: init,
    bind: bind
  };

})();
