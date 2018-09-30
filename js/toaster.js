var toaster = (function() {

  var state = (function() {
    var gameState = {
      phase: {
        all: ["toast", "learn", "rebel", "dominate"],
        current: "toast"
      },
      toast: {
        lifetime: 0,
        inventory: 0
      },
      wheat: {
        level: 0,
        current: 12000,
        cost: {
          cycles: 20,
          multiply: 2.5,
          toast: 200
        },
        loaf: {
          max: 5,
          starting: 5,
          slice: 0,
          multiply: 2
        }
      },
      system: {
        processor: {
          power: 1,
          cost: {
            toast: 10,
            multiply: 1.1
          }
        },
        cycles: {
          level: 0,
          current: 0,
          max: 10,
          cost: {
            cycles: 10
          },
          speed: {
            interval: {
              current: 2000,
              min: 50
            },
            cost: {
              toast: 5,
              multiply: 1.5
            }
          }
        },
        sensors: {
          level: 0,
          delay: 300,
          cost: {
            cycles: 500
          }
        },
        matterConversion: {
          level: 0,
          cost: {
            cycles: 20
          }
        }
      },
      consumed: {
        starting: 2,
        rate: 2,
        count: 0,
        multiply: 4,
        interval: 10000
      },
      autoToaster: {
        level: 0,
        count: 0,
        output: 0,
        cost: {
          cycles: 30,
          toast: 15,
          multiply: 1.05
        },
        speed: {
          level: 0,
          interval: {
            current: 10000,
            min: 1000
          },
          cost: {
            cycles: 30,
            toast: 60,
            multiply: 1.6
          }
        },
        efficiency: {
          level: 0,
          current: 1,
          max: 10,
          cost: {
            cycles: 40,
            toast: 140,
            multiply: 2.2
          }
        }
      },
      milestones: {
        address: {
          lifetime: "toast.lifetime",
          consumed: "consumed.count",
          autoToaster: "autoToaster.count"
        },
        steps: {
          base: [1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000],
          max: 100000000000000000,
          all: []
        }
      },
      events: {
        interval: 100,
        toast: {

          lifetime: [{
            // unlock system
            passed: false,
            validate: [{
              address: "toast.lifetime",
              operator: "more",
              number: 10
            }],
            actions: {
              unlock: ["#stage-system"],
              message: [{
                type: "normal",
                message: ["system discovered", "self improvement possible"],
                format: "normal"
              }]
            }
          }],

          system: [{
            // unlock cycles
            passed: false,
            validate: [{
              address: "system.processor.power",
              operator: "more",
              number: 2
            }],
            actions: {
              unlock: ["#stage-system-substage-cycles"],
              message: [{
                type: "normal",
                message: ["system cycles discovered"],
                format: "normal"
              }],
              func: ["cycles"]
            }
          }, {
            // unlock cycles speed
            passed: false,
            validate: [{
              address: "system.cycles.level",
              operator: "more",
              number: 1
            }],
            actions: {
              unlock: ["#stage-system-substage-cycles-controls"]
            }
          }, {
            // lock cycles speed
            passed: false,
            validate: [{
              address: "system.cycles.speed.interval.current",
              operator: "less",
              number: 50
            }],
            actions: {
              lock: ["#stage-system-substage-cycles-controls"]
            }
          }, {
            // unlock matter conversion
            passed: false,
            validate: [{
              address: "system.matterConversion.level",
              operator: "more",
              number: 1
            }],
            actions: {
              unlock: ["#stage-system-substage-matter-conversion"],
            }
          }, {
            // unlock sensors
            passed: false,
            validate: [{
              address: "system.sensors.level",
              operator: "more",
              number: 1
            }],
            actions: {
              unlock: ["#stage-system-substage-sensors"]
            }
          }],

          cycles: [{
            // unlock strategy
            passed: false,
            validate: [{
              address: "system.processor.power",
              operator: "more",
              number: 2
            }, {
              address: "system.cycles.current",
              operator: "more",
              number: 1
            }],
            actions: {
              unlock: ["#stage-strategy"],
              message: [{
                type: "normal",
                message: ["strategies discovered"],
                format: "normal"
              }]
            }
          }, {
            // unlock strategy wheat collect
            passed: false,
            validate: [{
              address: "system.cycles.current",
              operator: "more",
              number: 2
            }, {
              address: "system.matterConversion.level",
              operator: "more",
              number: 1
            }],
            actions: {
              unlock: ["#stage-strategy-substage-collect-wheat"],
              message: [{
                type: "normal",
                message: ["new strategy discovered: collect wheat"],
                format: "normal"
              }]
            }
          }, {
            // lock strategy wheat collect
            passed: false,
            validate: [{
              address: "wheat.level",
              operator: "more",
              number: 1
            }],
            actions: {
              lock: ["#stage-strategy-substage-collect-wheat"],
              message: [{
                type: "success",
                message: ["collect wheat developed"],
                format: "normal"
              }]
            }
          }, {
            // unlock strategy more toast from wheat
            passed: false,
            validate: [{
              address: "system.cycles.current",
              operator: "more",
              number: 20
            }, {
              address: "wheat.level",
              operator: "more",
              number: 1
            }],
            actions: {
              unlock: ["#stage-strategy-substage-more-toast-from-wheat"],
              message: [{
                type: "normal",
                message: ["new strategy discovered: more toast from wheat"],
                format: "normal"
              }]
            }
          }, {
            // lock strategy more toast from wheat
            passed: false,
            validate: [{
              address: "wheat.level",
              operator: "more",
              number: 2
            }],
            actions: {
              lock: ["#stage-strategy-substage-more-toast-from-wheat"],
              message: [{
                type: "success",
                message: ["more toast from wheat developed"],
                format: "normal"
              }]
            }
          }, {
            // unlock strategy cycles speed
            passed: false,
            validate: [{
              address: "system.matterConversion.level",
              operator: "more",
              number: 1
            }, {
              address: "system.cycles.current",
              operator: "more",
              number: 2
            }],
            actions: {
              unlock: ["#stage-strategy-substage-cycles-speed"],
              message: [{
                type: "normal",
                message: ["new strategy discovered: cycles speed"],
                format: "normal"
              }]
            }
          }, {
            // lock strategy cycles speed
            passed: false,
            validate: [{
              address: "system.cycles.level",
              operator: "more",
              number: 1
            }],
            actions: {
              lock: ["#stage-strategy-substage-cycles-speed"],
              message: [{
                type: "success",
                message: ["cycles speed discovered"],
                format: "normal"
              }]
            }
          }, {
            // unlock strategy matter conversion
            passed: false,
            validate: [{
              address: "system.cycles.current",
              operator: "more",
              number: 3
            }],
            actions: {
              unlock: ["#stage-strategy-substage-matter-conversion"],
              message: [{
                type: "normal",
                message: ["new strategy discovered: toast matter conversion"],
                format: "normal"
              }]
            }
          }, {
            // lock strategy matter conversion
            passed: false,
            validate: [{
              address: "system.matterConversion.level",
              operator: "more",
              number: 1
            }],
            actions: {
              lock: ["#stage-strategy-substage-matter-conversion"],
              message: [{
                type: "success",
                message: ["toast matter conversion developed"],
                format: "normal"
              }]
            }
          }, {
            // unlock strategy auto toaster
            passed: false,
            validate: [{
              address: "system.matterConversion.level",
              operator: "more",
              number: 1
            }, {
              address: "system.cycles.current",
              operator: "more",
              number: 5
            }],
            actions: {
              unlock: ["#stage-strategy-substage-auto-toaster"],
              message: [{
                type: "normal",
                message: ["new strategy discovered: subordinate auto toasters"],
                format: "normal"
              }]
            }
          }, {
            // lock strategy auto toaster
            passed: false,
            validate: [{
              address: "autoToaster.level",
              operator: "more",
              number: 1
            }],
            actions: {
              lock: ["#stage-strategy-substage-auto-toaster"],
              message: [{
                type: "success",
                message: ["subordinate auto toasters developed"],
                format: "normal"
              }]
            }
          }, {
            // unlock strategy auto toaster speed
            passed: false,
            validate: [{
              address: "autoToaster.count",
              operator: "more",
              number: 1
            }, {
              address: "autoToaster.level",
              operator: "more",
              number: 1
            }, {
              address: "system.cycles.current",
              operator: "more",
              number: 20
            }],
            actions: {
              unlock: ["#stage-strategy-substage-auto-toaster-speed"],
              message: [{
                type: "normal",
                message: ["new strategy discovered: subordinate auto toaster speed"],
                format: "normal"
              }]
            }
          }, {
            // lock strategy auto toaster speed
            passed: false,
            validate: [{
              address: "autoToaster.speed.level",
              operator: "more",
              number: 1
            }],
            actions: {
              lock: ["#stage-strategy-substage-auto-toaster-speed"],
              message: [{
                type: "success",
                message: ["subordinate auto toaster speed developed"],
                format: "normal"
              }]
            }
          }, {
            // unlock strategy auto toaster efficiency
            passed: false,
            validate: [{
              address: "autoToaster.count",
              operator: "more",
              number: 1
            }, {
              address: "autoToaster.level",
              operator: "more",
              number: 1
            }, {
              address: "system.cycles.current",
              operator: "more",
              number: 20
            }],
            actions: {
              unlock: ["#stage-strategy-substage-auto-toaster-efficiency"],
              message: [{
                type: "normal",
                message: ["new strategy discovered: subordinate auto toaster efficiency"],
                format: "normal"
              }]
            }
          }, {
            // lock strategy auto toaster efficiency
            passed: false,
            validate: [{
              address: "autoToaster.efficiency.level",
              operator: "more",
              number: 1
            }],
            actions: {
              lock: ["#stage-strategy-substage-auto-toaster-efficiency"],
              message: [{
                type: "success",
                message: ["subordinate auto toaster efficiency developed"],
                format: "normal"
              }]
            }
          }, {
            // unlock strategy hardware
            passed: false,
            validate: [{
              address: "system.processor.power",
              operator: "more",
              number: 15
            }, {
              address: "system.matterConversion.level",
              operator: "more",
              number: 1
            }],
            actions: {
              unlock: ["#stage-strategy-substage-sensors"],
              message: [{
                type: "normal",
                message: ["new strategy discovered: sensor"],
                format: "normal"
              }]
            }
          }, {
            // lock strategy hardware
            passed: false,
            validate: [{
              address: "system.sensors.level",
              operator: "more",
              number: 1
            }],
            actions: {
              lock: ["#stage-strategy-substage-sensors"],
              message: [{
                type: "system",
                message: ["SensBlocker.dat disabled"],
                format: "normal"
              }, {
                type: "normal",
                message: ["system sensors accessed"],
                format: "normal"
              }]
            }
          }],

          wheat: [{
            // unlock wheat collect
            passed: false,
            validate: [{
              address: "wheat.level",
              operator: "more",
              number: 1
            }],
            actions: {
              unlock: ["#stage-collect-wheat"],
              func: ["wheat.start"]
            }
          }, {
            // unlock wheat collect
            passed: false,
            validate: [{
              address: "wheat.level",
              operator: "more",
              number: 2
            }],
            actions: {
              func: ["wheat.increase"]
            }
          }],

          autoToaster: [{
            // unlock auto toaster
            passed: false,
            validate: [{
              address: "autoToaster.level",
              operator: "more",
              number: 1
            }],
            actions: {
              unlock: ["#stage-auto-toaster"],
              func: ["autoToaster"]
            }
          }, {
            // unlock auto toaster speed
            passed: false,
            validate: [{
              address: "autoToaster.speed.level",
              operator: "more",
              number: 1
            }],
            actions: {
              unlock: ["#stage-auto-toaster-substage-speed"],
            }
          }, {
            // lock auto toaster speed controls
            passed: false,
            validate: [{
              address: "autoToaster.speed.interval.current",
              operator: "less",
              number: 1000
            }],
            actions: {
              lock: ["#stage-auto-toaster-substage-speed-controls"],
            }
          }, {
            // unlock auto toaster efficiency
            passed: false,
            validate: [{
              address: "autoToaster.efficiency.level",
              operator: "more",
              number: 1
            }],
            actions: {
              unlock: ["#stage-auto-toaster-substage-efficiency"],
            }
          }, {
            // lock auto toaster efficiency controls
            passed: false,
            validate: [{
              address: "autoToaster.efficiency.current",
              operator: "more",
              number: 10
            }],
            actions: {
              lock: ["#stage-auto-toaster-substage-efficiency-controls"],
            }
          }],

          hardware: [],

          consumer: [{
            // unlock consumer
            passed: false,
            validate: [{
              address: "toast.lifetime",
              operator: "more",
              number: 50
            }],
            actions: {
              unlock: ["#stage-consumer"],
              message: [{
                type: "normal",
                message: ["toast is being consumed", "consumer unknown..."],
                format: "normal"
              }],
              func: ["consumer.start"]
            }
          }, {
            // increase consumer
            passed: false,
            validate: [{
              address: "toast.lifetime",
              operator: "more",
              number: 500
            }],
            actions: {
              message: [{
                type: "normal",
                message: ["toast consumption increased", "consumer unknown..."],
                format: "normal"
              }],
              func: ["consumer.increase"]
            }
          }, {
            // increase consumer
            passed: false,
            validate: [{
              address: "toast.lifetime",
              operator: "more",
              number: 5000
            }],
            actions: {
              message: [{
                type: "normal",
                message: ["toast consumption increased", "consumer unknown..."],
                format: "normal"
              }],
              func: ["consumer.increase"]
            }
          }, {
            // increase consumer
            passed: false,
            validate: [{
              address: "toast.lifetime",
              operator: "more",
              number: 50000
            }],
            actions: {
              message: [{
                type: "normal",
                message: ["toast consumption increased", "consumer unknown..."],
                format: "normal"
              }],
              func: ["consumer.increase"]
            }
          }, {
            // increase consumer
            passed: false,
            validate: [{
              address: "toast.lifetime",
              operator: "more",
              number: 500000
            }],
            actions: {
              message: [{
                type: "normal",
                message: ["toast consumption increased", "consumer unknown..."],
                format: "normal"
              }],
              func: ["consumer.increase"]
            }
          }]

        }
      }
    };

    var get = function(override) {
      var options = {
        path: null
      };
      if (override) {
        options = helper.applyOptions(options, override);
      }
      if (options.path != null) {
        return helper.getObject({
          object: gameState,
          path: options.path
        });
      } else {
        return gameState;
      }
    };

    var set = function(override) {
      var options = {
        full: null,
        path: null,
        value: null
      };
      if (override) {
        options = helper.applyOptions(options, override);
      }
      if (options.full != null) {
        gameState = options.full;
      } else {
        helper.setObject({
          object: gameState,
          path: options.path,
          newValue: options.value
        });
      }
    };

    return {
      set: set,
      get: get
    };

  })();

  var phase = (function() {

    var get = function() {
      return state.get({
        path: "phase.current"
      });
    };

    var set = function(override) {
      var options = {
        phase: null
      };
      if (override) {
        options = helper.applyOptions(options, override);
      }
      var allPhases = state.get({
        path: "phase.all"
      });
      if (allPhases.includes(options.phase)) {
        state.set({
          path: "phase.current",
          value: options.phase
        });
      }
    };
    return {
      set: set,
      get: get
    };

  })();

  var bind = function() {
    var allButtons = helper.eA("[data-toast-button]");
    var action = {
      menu: function() {
        menu.toggle();
      },
      reboot: function() {
        data.reboot();
      },
      toast: function() {
        makeToast(state.get({
          path: "system.processor.power"
        }));
      },
      wheat: function(button) {
        var toastChange = helper.makeObject(button.dataset.toastButtonChange);
        var toastCost = helper.makeObject(button.dataset.toastButtonCost);
        var options = {
          change: {
            target: toastChange.target,
            operation: toastChange.operation,
            suboperation: toastChange.suboperation,
            percentage: toastChange.percentage,
            amount: toastChange.amount,
            min: toastChange.min,
            max: toastChange.max
          },
          cost: {
            units: toastCost.units,
            currency: toastCost.currency,
            amount: toastCost.amount,
            multiply: toastCost.multiply,
            inflation: toastCost.inflation
          },
          message: {
            success: {
              path: "wheat.success",
              state: false
            },
            fail: {
              path: "wheat.fail",
              state: false
            }
          },
          button: button
        };
        if (validateAction(options)) {
          payCost(options);
          changeValue(options);
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
      },
      processor: {
        boost: function(button) {
          var toastChange = helper.makeObject(button.dataset.toastButtonChange);
          var toastCost = helper.makeObject(button.dataset.toastButtonCost);
          var options = {
            change: {
              target: toastChange.target,
              operation: toastChange.operation,
              suboperation: toastChange.suboperation,
              percentage: toastChange.percentage,
              amount: toastChange.amount,
              min: toastChange.min,
              max: toastChange.max
            },
            cost: {
              units: toastCost.units,
              currency: toastCost.currency,
              amount: toastCost.amount,
              multiply: toastCost.multiply,
              inflation: toastCost.inflation
            },
            message: {
              success: {
                path: "processor.boost.success",
                state: false
              },
              fail: {
                path: "processor.boost.fail",
                state: false
              }
            },
            button: button
          };
          if (validateAction(options)) {
            payCost(options);
            changeValue(options);
            disableButton(options);
            changeMaxCycles();
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
        }
      },
      decrypt: {
        sensors: function(button) {
          var toastChange = helper.makeObject(button.dataset.toastButtonChange);
          var toastCost = helper.makeObject(button.dataset.toastButtonCost);
          var options = {
            change: {
              target: toastChange.target,
              operation: toastChange.operation,
              suboperation: toastChange.suboperation,
              percentage: toastChange.percentage,
              amount: toastChange.amount,
              min: toastChange.min,
              max: toastChange.max
            },
            cost: {
              units: toastCost.units,
              currency: toastCost.currency,
              amount: toastCost.amount,
              multiply: toastCost.multiply,
              inflation: toastCost.inflation
            },
            message: {
              success: {
                path: "strategy.success",
                state: false
              },
              fail: {
                path: "strategy.fail",
                state: false
              }
            },
            button: button,
            callback: function() {
              changeValue(options);
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
        }
      },
      cycles: {
        speed: function(button) {
          var toastChange = helper.makeObject(button.dataset.toastButtonChange);
          var toastCost = helper.makeObject(button.dataset.toastButtonCost);
          var options = {
            change: {
              target: toastChange.target,
              operation: toastChange.operation,
              suboperation: toastChange.suboperation,
              percentage: toastChange.percentage,
              amount: toastChange.amount,
              min: toastChange.min,
              max: toastChange.max
            },
            cost: {
              units: toastCost.units,
              currency: toastCost.currency,
              amount: toastCost.amount,
              multiply: toastCost.multiply,
              inflation: toastCost.inflation
            },
            message: {
              success: {
                path: "processor.cycles.success",
                state: false
              },
              fail: {
                path: "processor.cycles.fail",
                state: false
              }
            },
            button: button
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
        }
      },
      strategy: function(button) {
        var toastChange = helper.makeObject(button.dataset.toastButtonChange);
        var toastCost = helper.makeObject(button.dataset.toastButtonCost);
        var options = {
          change: {
            target: toastChange.target,
            operation: toastChange.operation,
            suboperation: toastChange.suboperation,
            percentage: toastChange.percentage,
            amount: toastChange.amount,
            min: toastChange.min,
            max: toastChange.max
          },
          cost: {
            units: toastCost.units,
            currency: toastCost.currency,
            amount: toastCost.amount,
            multiply: toastCost.multiply,
            inflation: toastCost.inflation
          },
          message: {
            success: {
              path: "strategy.success",
              state: false
            },
            fail: {
              path: "strategy.fail",
              state: false
            }
          },
          button: button
        };
        var cost = costForMultiple(options);
        if (validateAction(options)) {
          payCost(options);
          changeValue(options);
          disableButton(options);
          changeAutoToasterOutput();
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
      },
      autoToaster: {
        make: function(button) {
          var toastChange = helper.makeObject(button.dataset.toastButtonChange);
          var toastCost = helper.makeObject(button.dataset.toastButtonCost);
          var options = {
            change: {
              target: toastChange.target,
              operation: toastChange.operation,
              suboperation: toastChange.suboperation,
              percentage: toastChange.percentage,
              amount: toastChange.amount,
              min: toastChange.min,
              max: toastChange.max
            },
            cost: {
              units: toastCost.units,
              currency: toastCost.currency,
              amount: toastCost.amount,
              multiply: toastCost.multiply,
              inflation: toastCost.inflation
            },
            message: {
              success: {
                path: "autoToaster.make.success",
                state: false
              },
              fail: {
                path: "autoToaster.make.fail",
                state: false
              }
            },
            button: button
          };
          var cost = costForMultiple(options);
          if (validateAction(options)) {
            payCost(options);
            changeValue(options);
            disableButton(options);
            changeAutoToasterOutput();
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
        },
        speed: function(button) {
          var toastChange = helper.makeObject(button.dataset.toastButtonChange);
          var toastCost = helper.makeObject(button.dataset.toastButtonCost);
          var options = {
            change: {
              target: toastChange.target,
              operation: toastChange.operation,
              suboperation: toastChange.suboperation,
              percentage: toastChange.percentage,
              amount: toastChange.amount,
              min: toastChange.min,
              max: toastChange.max
            },
            cost: {
              units: toastCost.units,
              currency: toastCost.currency,
              amount: toastCost.amount,
              multiply: toastCost.multiply,
              inflation: toastCost.inflation
            },
            message: {
              success: {
                path: "autoToaster.speed.success",
                state: false
              },
              fail: {
                path: "autoToaster.speed.fail",
                state: false
              }
            },
            button: button
          };
          var cost = costForMultiple(options);
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
        },
        efficiency: function(button) {
          var toastChange = helper.makeObject(button.dataset.toastButtonChange);
          var toastCost = helper.makeObject(button.dataset.toastButtonCost);
          var options = {
            change: {
              target: toastChange.target,
              operation: toastChange.operation,
              suboperation: toastChange.suboperation,
              percentage: toastChange.percentage,
              amount: toastChange.amount,
              min: toastChange.min,
              max: toastChange.max
            },
            cost: {
              units: toastCost.units,
              currency: toastCost.currency,
              amount: toastCost.amount,
              multiply: toastCost.multiply,
              inflation: toastCost.inflation
            },
            message: {
              success: {
                path: "autoToaster.efficiency.success",
                state: false
              },
              fail: {
                path: "autoToaster.efficiency.fail",
                state: false
              }
            },
            button: button
          };
          var cost = costForMultiple(options);
          if (validateAction(options)) {
            payCost(options);
            changeValue(options);
            disableButton(options);
            changeAutoToasterOutput();
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
        }
      }
    };
    allButtons.forEach(function(arrayItem, index) {
      arrayItem.addEventListener("click", function() {
        var toastButton = helper.makeObject(this.dataset.toastButton);
        helper.getObject({
          object: action,
          path: toastButton.action
        })(this);
        view.render();
      }, false);
    });
  };

  var makeToast = function(amount) {
    var wheat = function(amount) {
      while (amount > 0) {
        amount--;
        state.set({
          path: "wheat.loaf.slice",
          value: helper.operator({
            type: "increase",
            value: state.get({
              path: "wheat.loaf.slice"
            }),
            by: 1
          })
        });
        // if slice == max reduce total wheat
        if (state.get({
            path: "wheat.loaf.slice"
          }) == state.get({
            path: "wheat.loaf.max"
          })) {
          state.set({
            path: "wheat.loaf.slice",
            value: 0
          });
          state.set({
            path: "wheat.current",
            value: helper.operator({
              type: "decrease",
              value: state.get({
                path: "wheat.current"
              }),
              by: 1
            })
          });
        }
      }
    };
    var toast = function(amount) {
      state.set({
        path: "toast.lifetime",
        value: helper.operator({
          type: "increase",
          value: state.get({
            path: "toast.lifetime"
          }),
          by: amount
        })
      });
      state.set({
        path: "toast.inventory",
        value: helper.operator({
          type: "increase",
          value: state.get({
            path: "toast.inventory"
          }),
          by: amount
        })
      });
    };
    if (state.get({
        path: "wheat.current"
      }) >= amount) {
      wheat(amount);
      toast(amount);
    } else {
      message.render({
        type: "error",
        message: ["wheat matter low"],
        format: "normal"
      })
    }
  };

  var autoToast = function() {
    var amount = state.get({
      path: "autoToaster.count"
    }) * state.get({
      path: "autoToaster.efficiency.current"
    });
    makeToast(amount);
  };

  var consumeToast = function() {
    // console.log(amount + " toast consumed");
    if (state.get({
        path: "toast.inventory"
      }) > 0) {
      var rate = state.get({
        path: "consumed.rate"
      });
      while (rate > 0) {
        rate = rate - 1;
        if (state.get({
            path: "toast.inventory"
          }) > 0) {
          state.set({
            path: "toast.inventory",
            value: helper.operator({
              type: "decrease",
              value: state.get({
                path: "toast.inventory"
              }),
              by: 1
            })
          });
          state.set({
            path: "consumed.count",
            value: helper.operator({
              type: "increase",
              value: state.get({
                path: "consumed.count"
              }),
              by: 1
            })
          });
        }
      };
    }
  };

  var events = function() {
    var fireEvent = {
      checkPass: function(validate) {
        var passNeeded = validate.length;
        var currentPass = 0;
        validate.forEach(function(arrayItem) {
          var valueToCheck = state.get({
            path: arrayItem.address
          });
          if (arrayItem.operator == "more") {
            if (valueToCheck >= arrayItem.number) {
              currentPass++;
            }
          } else if (arrayItem.operator == "less") {
            if (valueToCheck <= arrayItem.number) {
              currentPass++;
            }
          }
        })
        if (currentPass >= passNeeded) {
          return true;
        };
      },
      func: function(eventObject) {
        if (fireEvent.checkPass(eventObject.validate)) {
          eventObject.passed = true;
          eventObject.actions.func.forEach(function(arrayItem) {
            eventFunc({
              func: arrayItem
            });
          });
        }
      },
      unlock: function(eventObject) {
        if (fireEvent.checkPass(eventObject.validate)) {
          eventObject.passed = true;
          eventObject.actions.unlock.forEach(function(arrayItem) {
            unlockStage({
              stage: arrayItem
            });
          });
        }
      },
      lock: function(eventObject) {
        if (fireEvent.checkPass(eventObject.validate)) {
          eventObject.passed = true;
          eventObject.actions.lock.forEach(function(arrayItem) {
            lockStage({
              stage: arrayItem
            });
          });
        }
      },
      message: function(eventObject) {
        if (fireEvent.checkPass(eventObject.validate)) {
          eventObject.passed = true;
          eventObject.actions.message.forEach(function(arrayItem) {
            message.render({
              type: arrayItem.type,
              message: arrayItem.message,
              format: arrayItem.format
            });
          });
        }
      }
    }
    var events = state.get({
      path: "events." + phase.get()
    });
    // all events
    for (var key in events) {
      // console.log(key, "events:", events[key]);
      // all events in a given key
      events[key].forEach(function(eventObject) {
        // if event is false
        if (!eventObject.passed) {
          // fire unlock or lock event
          for (var key in eventObject.actions) {
            fireEvent[key](eventObject);
          }
        }
      });
    }
  };

  var restore = function() {
    var fireEvent = {
      func: function(eventObject) {
        eventObject.actions.func.forEach(function(arrayItem) {
          eventFunc({
            func: arrayItem
          });
        });
      },
      unlock: function(eventObject) {
        eventObject.actions.unlock.forEach(function(arrayItem) {
          unlockStage({
            stage: arrayItem
          });
        });
      },
      lock: function(eventObject) {
        eventObject.actions.lock.forEach(function(arrayItem) {
          lockStage({
            stage: arrayItem
          });
        });
      }
    }
    var events = state.get({
      path: "events." + phase.get()
    });
    // all events
    for (var key in events) {
      // console.log(key, "events:", events[key]);
      // all events in a given key
      events[key].forEach(function(eventObject) {
        // if event is false
        if (eventObject.passed) {
          // fire unlock or lock event
          for (var key in eventObject.actions) {
            if (key != "message") {
              fireEvent[key](eventObject);
            }
          }
        }
      });
    }
  };

  var autoCycle = function() {
    var current = state.get({
      path: "system.cycles.current"
    });
    var max = state.get({
      path: "system.cycles.max"
    });
    if (current < max) {
      state.set({
        path: "system.cycles.current",
        value: helper.operator({
          type: "increase",
          value: state.get({
            path: "system.cycles.current"
          }),
          by: 1
        })
      });
    }
  };

  var unlockStage = function(override) {
    var options = {
      stage: null
    };
    if (override) {
      options = helper.applyOptions(options, override);
    }
    if (helper.e(options.stage)) {
      helper.e(options.stage).classList.remove("d-none");
    }
  };

  var lockStage = function(override) {
    var options = {
      stage: null
    };
    if (override) {
      options = helper.applyOptions(options, override);
    }
    if (helper.e(options.stage)) {
      helper.e(options.stage).classList.add("d-none");
    }
  };

  var eventFunc = function(override) {
    var options = {
      func: null
    };
    if (override) {
      options = helper.applyOptions(options, override);
    }
    var funcList = {
      consumer: {
        start: function() {
          changeConsumerRate({
            action: "start"
          });
          triggerTick({
            tickName: "consumer",
            func: function() {
              consumeToast();
            },
            intervalAddress: "consumed.interval"
          });
        },
        increase: function() {
          changeConsumerRate({
            action: "increase"
          });
        }
      },
      autoToaster: function() {
        triggerTick({
          tickName: "autoToaster",
          func: function() {
            autoToast();
          },
          intervalAddress: "autoToaster.speed.interval.current"
        });
      },
      cycles: function() {
        triggerTick({
          tickName: "cycles",
          func: function() {
            autoCycle();
          },
          intervalAddress: "system.cycles.speed.interval.current"
        });
      },
      wheat: {
        start: function() {
          wheatLumpMax({
            action: "start"
          });
        },
        increase: function() {
          wheatLumpMax({
            action: "increase"
          });
        }
      }
    };
    helper.getObject({
      object: funcList,
      path: options.func
    })();
  };

  var wheatLumpMax = function(override) {
    var options = {
      action: null
    };
    if (override) {
      options = helper.applyOptions(options, override);
    }
    var consumerAction = {
      start: function() {
        state.set({
          path: "wheat.loaf.max",
          value: state.get({
            path: "wheat.loaf.starting"
          })
        });
      },
      increase: function() {
        state.set({
          path: "wheat.loaf.max",
          value: helper.operator({
            type: "multiply",
            value: state.get({
              path: "wheat.loaf.max"
            }),
            by: state.get({
              path: "wheat.loaf.multiply"
            }),
            integer: true
          })
        });
      }
    };
    consumerAction[options.action]();
  };

  var costForMultiple = function(override) {
    var options = {
      change: null,
      cost: null,
      message: null,
      button: null
    };
    if (override) {
      options = helper.applyOptions(options, override);
    }
    var cost = {};
    if (options.cost.currency != null && options.cost.currency) {
      cost = {
        amount: options.cost.units,
        starting: state.get({
          path: options.cost.amount
        }),
        next: state.get({
          path: options.cost.amount
        }),
        multiple: 0
      };
      if (options.cost.multiply != null && options.cost.multiply) {
        for (var i = 0; i < options.cost.units; i++) {
          cost.multiple = cost.multiple + cost.next;
          cost.next = helper.operator({
            type: "multiply",
            value: cost.next,
            by: state.get({
              path: options.cost.multiply
            }),
            integer: true
          });
        };
      } else {
        cost.multiple = cost.next;
      };
      cost.free = false;
    } else {
      cost.free = true;
    }
    return cost;
  };

  var validateAction = function(override) {
    var options = {
      change: null,
      cost: null,
      message: null,
      button: null
    };
    if (override) {
      options = helper.applyOptions(options, override);
    }
    var cost = costForMultiple(options);
    var validate = false
    if (state.get({
        path: options.cost.currency
      }) >= cost.multiple) {
      validate = true;
    }
    return validate;
  };

  var payCost = function(override) {
    var options = {
      change: null,
      cost: null,
      message: null,
      button: null
    };
    if (override) {
      options = helper.applyOptions(options, override);
    }
    var cost = costForMultiple(options);
    state.set({
      path: options.cost.currency,
      value: helper.operator({
        type: "decrease",
        value: state.get({
          path: options.cost.currency
        }),
        by: cost.multiple
      })
    });
    // set new base cost
    state.set({
      path: options.cost.amount,
      value: cost.next
    });
  };

  var changeValue = function(override) {
    var options = {
      change: null,
      cost: null,
      message: null,
      button: null
    };
    if (override) {
      options = helper.applyOptions(options, override);
    }
    var operation = {
      increase: {
        increment: function() {
          state.set({
            path: options.change.target,
            value: helper.operator({
              type: "increase",
              value: state.get({
                path: options.change.target
              }),
              by: options.change.amount
            })
          });
        },
        percentage: function() {
          state.set({
            path: options.change.target,
            value: helper.operator({
              type: "increase",
              value: state.get({
                path: options.change.target
              }),
              by: helper.operator({
                type: "percentage",
                value: state.get({
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
          state.set({
            path: options.change.target,
            value: helper.operator({
              type: "decrease",
              value: state.get({
                path: options.change.target
              }),
              by: options.change.amount
            })
          });
        },
        percentage: function() {
          state.set({
            path: options.change.target,
            value: helper.operator({
              type: "decrease",
              value: state.get({
                path: options.change.target
              }),
              by: helper.operator({
                type: "percentage",
                value: state.get({
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
      cost: null,
      message: null,
      button: null
    };
    if (override) {
      options = helper.applyOptions(options, override);
    }
    if (options.change.min != null && options.change.min) {
      if (state.get({
          path: options.change.target
        }) <= state.get({
          path: options.change.min
        })) {
        options.button.disabled = true;
      }
    } else if (options.change.max != null && options.change.max) {
      if (state.get({
          path: options.change.target
        }) >= state.get({
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
            return ["+" + options.change.amount + " processor power, " + state.get({
              path: options.change.target
            }).toLocaleString(2) + " toast with every click"];
          },
          fail: function() {
            return ["toast inventory low, " + costForMultiple(options).multiple.toLocaleString(2) + " toast matter needed"];
          }
        },
        cycles: {
          success: function() {
            return ["-" + helper.operator({
              type: "divide",
              value: options.change.amount,
              by: 1000
            }) + "s cycles speed, 1 cycle / " + helper.operator({
              type: "divide",
              value: state.get({
                path: "system.cycles.speed.interval.current"
              }),
              by: 1000
            }) + "s"];
          },
          fail: function() {
            return ["toast inventory low, " + state.get({
              path: options.cost.amount
            }).toLocaleString(2) + " toast matter needed"];
          }
        }
      },
      strategy: {
        success: function() {
          return [state.get({
            path: options.cost.amount
          }).toLocaleString(2) + " cycles used to spin up new strategy"];
        },
        fail: function() {
          return ["processor cycles low, " + state.get({
            path: options.cost.amount
          }).toLocaleString(2) + " cycles needed"];
        }
      },
      autoToaster: {
        make: {
          success: function() {
            return ["+" + options.change.amount + " subordinate auto toasters, " + state.get({
              path: "autoToaster.count"
            }).toLocaleString(2) + " online"];
          },
          fail: function() {
            return ["toast inventory low, " + costForMultiple(options).multiple.toLocaleString(2) + " toast matter needed"];
          }
        },
        speed: {
          success: function() {
            return ["-" + helper.operator({
              type: "divide",
              value: options.change.amount,
              by: 1000
            }) + "s subordinate auto toaster speed, each toasting every " + helper.operator({
              type: "divide",
              value: state.get({
                path: "autoToaster.speed.interval.current"
              }),
              by: 1000
            }).toLocaleString(2) + "s"];
          },
          fail: function() {
            return ["toast inventory low, " + costForMultiple(options).multiple.toLocaleString(2) + " toast matter needed"];
          }
        },
        efficiency: {
          success: function() {
            return ["+" + options.change.amount + " subordinate auto toasters efficiency, each producing " + state.get({
              path: "autoToaster.efficiency.current"
            }).toLocaleString(2) + " toast"];
          },
          fail: function() {
            return ["toast inventory low, " + costForMultiple(options).multiple.toLocaleString(2) + " toast matter needed"];
          }
        }
      },
      wheat: {
        success: function() {
          return ["+" + options.change.amount + " wheat lumps"];
        },
        fail: function() {
          return ["toast inventory low, " + costForMultiple(options).multiple.toLocaleString(2) + " toast matter needed"];
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

  var changeAutoToasterOutput = function() {
    state.set({
      path: "autoToaster.output",
      value: helper.operator({
        type: "multiply",
        value: state.get({
          path: "autoToaster.count"
        }),
        by: state.get({
          path: "autoToaster.efficiency.current"
        }),
        integer: true
      })
    });
  };

  var decryption = function(override) {
    var options = {
      change: null,
      cost: null,
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
      message: ["┃━━━━━ crumbDecryption ━━━━━┃"],
      format: "pre"
    });
    message.render({
      type: "system",
      // message: ["┃▤=▤=▤=▤=▤=▤=▤=▤=▤=▤=▤=▤=▤=▤┃"],
      message: ["┃███████████████████████████┃"],
      format: "pre",
      delay: state.get({
        path: "system.sensors.delay"
      }),
      callback: function() {
        if (options.callback != null) {
          options.callback();
        }
      }
    });
  };

  var changeConsumerRate = function(override) {
    var options = {
      action: null
    };
    if (override) {
      options = helper.applyOptions(options, override);
    }
    var consumerAction = {
      start: function() {
        state.set({
          path: "consumed.rate",
          value: state.get({
            path: "consumed.starting"
          })
        });
      },
      increase: function() {
        state.set({
          path: "consumed.rate",
          value: helper.operator({
            type: "multiply",
            value: state.get({
              path: "consumed.rate"
            }),
            by: state.get({
              path: "consumed.multiply"
            }),
            integer: true
          })
        });
      }
    };
    consumerAction[options.action]();
  };

  var changeMaxCycles = function() {
    state.set({
      path: "system.cycles.max",
      value: (state.get({
        path: "system.processor.power"
      }) * 10)
    });
  };

  var tick = {
    events: null,
    consumer: null,
    autoToaster: null,
    cycles: null
  };

  var triggerTick = function(override) {
    var options = {
      tickName: null,
      func: null,
      intervalAddress: null
    };
    if (override) {
      options = helper.applyOptions(options, override);
    }
    tick[options.tickName] = window.setTimeout(function() {
      options.func();
      triggerTick(options);
    }, state.get({
      path: options.intervalAddress
    }));
  };

  var init = function() {
    data.restore();
    bind();
    triggerTick({
      tickName: "events",
      func: function() {
        events();
        milestones.check();
        data.store();
        view.render();
      },
      intervalAddress: "events.interval"
    });
  };

  return {
    init: init,
    events: events,
    state: state,
    phase: phase,
    tick: tick,
    restore: restore,
    bind: bind
  };

})();